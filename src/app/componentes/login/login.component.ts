import { Component } from '@angular/core';
import { UsuarioService } from '../../service/usuario/usuario.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  login: any = "";
  senha: string = ""
  error: string | null = null;
  showPassword: boolean = false;
  formulario!: FormGroup;

  constructor(
    private usuarioService: UsuarioService, 
    private router : Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      login: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  enviarLogin() {
    if (this.formulario.valid) {
      this.usuarioService.login(this.formulario.value).subscribe({
        next: (response) => {
          localStorage.clear();
          localStorage.setItem('token', response.token);
          this.error = null;
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.error = 'Login ou senha inválidos';
        }
      })
    } else {
      
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
