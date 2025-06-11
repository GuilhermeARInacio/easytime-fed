import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../service/usuario/usuario.service';
import { temLetraValidacao, temEspecialValidacao, senhasIguaisValidacao, temNumeroValidacao } from '../../validators/custom-validators';
import { NotificacaoComponent } from '../notificacao/notificacao.component';
import { NotificacaoService } from '../../service/notificacao/notificacao.service';
import { Notificacao } from '../../interface/notificacao';

@Component({
  selector: 'app-trocar-senha',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule, NotificacaoComponent],
  templateUrl: './trocar-senha.component.html',
  styleUrl: './trocar-senha.component.css',
})
export class TrocarSenhaComponent {

  formulario!: FormGroup;
  error: string | null = null;
  sucesso: string | null = null;
  shakeFields: { [key: string]: boolean } = {};
  showPassword: boolean = false;
  email: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService, 
    private router : Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ){
    const navegacao = this.router.getCurrentNavigation();
    if (navegacao?.extras.state) {
      this.sucesso = navegacao.extras.state['response'] || null;
      this.email = navegacao.extras.state['email'] || null;
    }
  }

  ngOnInit(){
    this.formulario = this.formBuilder.group({
      codigo: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ])],
      novaSenha: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        temLetraValidacao,
        temNumeroValidacao,
        temEspecialValidacao
      ])],
      repetirSenha: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])]
    },
    {
      validators: senhasIguaisValidacao('novaSenha', 'repetirSenha')
    }
    );

    this.formulario.get('codigo')?.valueChanges.subscribe(() => {
      this.error = null;
    });
    this.formulario.get('novaSenha')?.valueChanges.subscribe(() => {
      this.error = null;
    });
    this.formulario.get('repetirSenha')?.valueChanges.subscribe(() => {
      this.error = null;
    });

    if (this.email) {
      this.abrirNotificacao({
        titulo: 'E-mail enviado',
        mensagem: 'Um e-mail foi enviado para o endereço cadastrado com o código de recuperação. Verifique sua caixa de entrada.',
        tipo: 'enviado',
        icon: 'send'
      })
    }
  }

  abrirNotificacao(notificacao: Notificacao) {
    setTimeout(() => {
      this.notificacaoService.abrirNotificacao(notificacao);
    }, 0);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  enviarTrocaSenha(){
    this.sucesso = null;

    if (this.formulario.valid) {
      const trocarSenha = {
        code: this.formulario.get('codigo')?.value,
        email: this.email || '',
        senha: this.formulario.get('novaSenha')?.value
      }

      this.usuarioService.trocarSenha(trocarSenha).subscribe({
        next: (response) => {
          console.log('Senha atualizada com sucesso:', response);
          this.error = null;
          this.sucesso = response + ". Redirecionando para a página de login...";

          this.abrirNotificacao({
            titulo: 'Senha alterada',
            mensagem: this.sucesso,
            tipo: 'sucesso',
            icon: ''
          })

          this.formulario.markAsUntouched();
          setTimeout(() => {
            this.router.navigate(['/login'], { state: { response: response } });
          }, 1000);
        },
        error: (err) => {
          this.formulario.markAsUntouched();
          console.error('Erro ao trocar de senha:', err);

          if (err.status === 401) {
            this.error = 'Código inválido. Solicite um novo código de recuperação.';
          } else {
            this.error = err.error.message || 'Código inválido. Solicite um novo código de recuperação.';
          }
          
          this.abrirNotificacao({
            titulo: 'Erro',
            mensagem: this.error ?? '',
            tipo: 'erro',
            icon: ''
          })
        }
      });
    } else {
      this.formulario.markAllAsTouched();

      Object.keys(this.formulario.controls).forEach((controlName) => {
        const control = this.formulario.get(controlName);
        if (control?.invalid) {
          this.shakeFields[controlName] = true;

          // Remove a classe após a animação (300ms)
          setTimeout(() => {
            this.shakeFields[controlName] = false;
          }, 300);
        }
      });
      return;
    }
  }
}