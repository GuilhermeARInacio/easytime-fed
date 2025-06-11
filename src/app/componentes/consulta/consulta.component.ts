import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificacaoService } from '../../service/notificacao/notificacao.service';
import { UsuarioService } from '../../service/usuario/usuario.service';
import { RegistroPonto } from '../../interface/registro-ponto';
import { dataFinalAntesDeInicio, datasDepoisDeDataAtual } from '../../validators/custom-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consulta',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css'
})
export class ConsultaComponent {

  formulario!: FormGroup;
  registros: RegistroPonto[] = [];
  error: string | null = null;
  sucesso: string | null = null;
  shakeFields: { [key: string]: boolean } = {};

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService,
    private router: Router
  ){}

  ngOnInit() {
    if(!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }

    this.formulario = this.formBuilder.group({
      inicio: ['', Validators.required],
      final: ['', Validators.required]
    },
    {    
      validators: Validators.compose([
        dataFinalAntesDeInicio('inicio', 'final'),
        datasDepoisDeDataAtual('inicio', 'final')
      ])
    });

    this.formulario.get('inicio')?.valueChanges.subscribe(() => {
      this.error = null;
    });
    this.formulario.get('final')?.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  consultar() {
    this.error = null;
    this.sucesso = null;
    this.shakeFields = {};

    if(this.formulario.valid){
      const consultarRegistro = {
        login: localStorage.getItem('login') || '',
        dtInicio: this.formatarData(this.formulario.value.inicio),
        dtFinal: this.formatarData(this.formulario.value.final)
      }

      console.log('Consultando registros:', consultarRegistro);

      this.usuarioService.consultarPonto(consultarRegistro).subscribe({
        next: (response) => {
          this.registros = response;
          console.log(this.registros);
          this.sucesso = 'Registros consultados com sucesso.';
          if (this.registros.length === 0) {
            this.error = 'Nenhum registro encontrado para o período informado.';
          }
        },
        error: (error) => {
          if( error.status === 401) {
            this.error = error.error.message || 'Login expirado. Por favor, faça login novamente.';
            
            setInterval(() => {
              this.usuarioService.sair();
            }, 1000);
          }
          this.error = error.error.message || 'Erro ao consultar registros.';
        }
      });
    } else {
      console.log('Formulário inválido:', this.formulario.errors);
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
    }
  }

  formatarData(data: string): string {
    if (!data) return '';

    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}
