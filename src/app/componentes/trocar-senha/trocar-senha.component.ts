import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../service/usuario/usuario.service';

@Component({
  selector: 'app-trocar-senha',
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterModule],
  templateUrl: './trocar-senha.component.html',
  styleUrl: './trocar-senha.component.css'
})
export class TrocarSenhaComponent {

  formularioEmail!: FormGroup;
  error: string | null = null;
  sucesso: string | null = null;
  shakeFields: { [key: string]: boolean } = {};

  constructor(
    private usuarioService: UsuarioService, 
    private router : Router,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(){
    this.formularioEmail = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])]
    });
  }

  enviarEmail(){
    if (this.formularioEmail.valid) {
      this.usuarioService.enviarCodigo(this.formularioEmail.value).subscribe({
        next: (response) => {
          console.log('Email enviado com sucesso:', response);
          this.error = null;
          this.sucesso = response;
        },
        error: (err) => {
          console.error('Erro ao enviar email:', err);

          if (err.status === 401) {
            this.error = 'Login ou senha inválidos. Verifique suas credenciais.';
          } else {
            this.error = err.error.message || 'Erro ao enviar email. Verifique se o email está correto.';
          }
        }
      });
    } else {
      this.formularioEmail.markAllAsTouched();

      this.shakeFields['email'] = true;
      setTimeout(() => {
        this.shakeFields['email'] = false;
      }, 300);
    }
  }

}
