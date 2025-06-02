import { Component } from '@angular/core';
import { UsuarioService } from '../../service/usuario/usuario.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { senhaValidacao } from '../../validators/custom-validators';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  error: string | null = null;
  showPassword: boolean = false;
  formulario!: FormGroup;
  shakeFields: { [key: string]: boolean } = {};

  constructor(
    private usuarioService: UsuarioService, 
    private router : Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      login: ['', Validators.compose([
        Validators.required,
        Validators.pattern("^(?=.*[a-zA-Z])[a-zA-Z0-9._]+$")
      ])],
      senha: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        senhaValidacao
      ])]
    });
  
    this.formulario.get('login')?.valueChanges.subscribe(() => {
      this.error = null;
    });
    this.formulario.get('senha')?.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  enviarLogin() {
    if (this.formulario.valid) {
      this.usuarioService.login(this.formulario.value).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('login', this.formulario.get('login')?.value || '');
          
          this.error = null;
          this.router.navigate(['/bater-ponto']);
        },
        error: (err) => {
          console.error('Login failed:', err);

          if (err.status === 401) {
            this.error = 'Login ou senha inválidos. Verifique suas credenciais.';
          } else {
            this.error = err.error.message || 'Erro ao realizar login. Tente novamente mais tarde.';
          }
        }
      })
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}