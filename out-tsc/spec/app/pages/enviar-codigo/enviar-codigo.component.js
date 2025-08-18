import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
let EnviarCodigoComponent = class EnviarCodigoComponent {
    usuarioService;
    router;
    formBuilder;
    formulario;
    error = null;
    sucesso = null;
    shakeFields = {};
    carregando = false;
    constructor(usuarioService, router, formBuilder) {
        this.usuarioService = usuarioService;
        this.router = router;
        this.formBuilder = formBuilder;
    }
    ngOnInit() {
        this.formulario = this.formBuilder.group({
            email: ['', Validators.compose([
                    Validators.required,
                    Validators.email
                ])]
        });
        this.formulario.get('email')?.valueChanges.subscribe(() => {
            this.error = null;
        });
    }
    enviarEmail() {
        if (this.formulario.valid) {
            this.carregando = true;
            this.error = null;
            this.usuarioService.enviarCodigo(this.formulario.value).subscribe({
                next: (response) => {
                    this.error = null;
                    this.sucesso = response;
                    this.router.navigate(['/trocar-senha'], { state: { response: response, email: this.formulario.get('email')?.value } });
                    this.carregando = false;
                },
                error: (err) => {
                    console.error('Erro ao enviar email:', err);
                    this.carregando = false;
                    if (err.status === 401) {
                        this.error = 'Login ou senha inválidos. Verifique suas credenciais.';
                    }
                    else if (err.status === 500 || err.status === 502 || err.status === 0) {
                        this.error = 'Desculpe, ocorreu um erro interno. Tente novamente mais tarde.';
                    }
                    else {
                        this.error = (err.error) ? err.error : 'Erro ao enviar email. Verifique se o email está correto.';
                    }
                }
            });
        }
        else {
            this.formulario.markAllAsTouched();
            this.shakeFields['email'] = true;
            setTimeout(() => {
                this.shakeFields['email'] = false;
            }, 300);
        }
    }
};
EnviarCodigoComponent = __decorate([
    Component({
        selector: 'app-enviar-codigo',
        imports: [FormsModule, ReactiveFormsModule, NgIf, RouterModule],
        templateUrl: './enviar-codigo.component.html',
        styleUrl: './enviar-codigo.component.css'
    })
], EnviarCodigoComponent);
export { EnviarCodigoComponent };
