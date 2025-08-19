import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { senhaValidacao } from '../../validators/custom-validators';
let LoginComponent = class LoginComponent {
    usuarioService;
    router;
    formBuilder;
    error = null;
    showPassword = false;
    formulario;
    shakeFields = {};
    constructor(usuarioService, router, formBuilder) {
        this.usuarioService = usuarioService;
        this.router = router;
        this.formBuilder = formBuilder;
    }
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
                    localStorage.setItem('role', response.role);
                    this.error = null;
                    this.router.navigate(['/bater-ponto']);
                },
                error: (err) => {
                    console.error('Login failed:', err);
                    if (err.status === 401) {
                        this.error = 'Login ou senha inválidos. Verifique suas credenciais.';
                    }
                    else if (err.status === 500 || err.status === 502 || err.status === 0) {
                        this.error = 'Desculpe, ocorreu um erro interno. Tente novamente mais tarde.';
                    }
                    else {
                        this.error = err.error || 'Erro ao realizar login. Tente novamente mais tarde.';
                    }
                }
            });
        }
        else {
            this.formulario.markAllAsTouched();
            Object.keys(this.formulario.controls).forEach((controlName) => {
                const control = this.formulario.get(controlName);
                if (control?.invalid) {
                    this.shakeFields[controlName] = true;
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
};
LoginComponent = __decorate([
    Component({
        selector: 'app-login',
        imports: [FormsModule, ReactiveFormsModule, NgIf, RouterModule],
        templateUrl: './login.component.html',
        styleUrl: './login.component.css'
    })
], LoginComponent);
export { LoginComponent };
