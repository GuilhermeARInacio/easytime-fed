import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuLateralComponent } from '../../componentes/menu-lateral/menu-lateral.component';
import { NotificacaoComponent } from '../../componentes/notificacao/notificacao.component';
import { senhasIguaisValidacao, temEspecialValidacao, temLetraValidacao, temNumeroValidacao } from '../../validators/custom-validators';
let CadastroFuncionarioComponent = class CadastroFuncionarioComponent {
    formBuilder;
    usuarioService;
    popUpService;
    router;
    formulario;
    usuario = localStorage.getItem('login') || '';
    error = null;
    sucesso = null;
    shakeFields = {};
    showPassword = false;
    constructor(formBuilder, usuarioService, popUpService, router) {
        this.formBuilder = formBuilder;
        this.usuarioService = usuarioService;
        this.popUpService = popUpService;
        this.router = router;
    }
    ngOnInit() {
        if (!localStorage.getItem('token')) {
            this.router.navigate(['/login']);
        }
        this.formulario = this.formBuilder.group({
            nome: ['', Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                    Validators.pattern(/^[a-zA-Z\s]+$/)
                ])],
            email: ['', Validators.compose([
                    Validators.required,
                    Validators.email
                ])],
            login: ['', Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                    Validators.pattern(/^(?=.*[a-zA-Z]).+$/)
                ])],
            setor: ['', Validators.required],
            cargo: ['', Validators.required],
            senha: ['', Validators.compose([
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
        }, {
            validators: senhasIguaisValidacao('senha', 'repetirSenha')
        });
        this.formulario.get('nome')?.valueChanges.subscribe(() => {
            this.error = null;
        });
        this.formulario.get('email')?.valueChanges.subscribe(() => {
            this.error = null;
        });
        this.formulario.get('login')?.valueChanges.subscribe(() => {
            this.error = null;
        });
        this.formulario.get('setor')?.valueChanges.subscribe(() => {
            this.error = null;
        });
        this.formulario.get('cargo')?.valueChanges.subscribe(() => {
            this.error = null;
        });
        this.formulario.get('senha')?.valueChanges.subscribe(() => {
            this.error = null;
        });
        this.formulario.get('repetirSenha')?.valueChanges.subscribe(() => {
            this.error = null;
        });
    }
    abrirNotificacao(notificacao) {
        setTimeout(() => {
            this.popUpService.abrirNotificacao(notificacao);
        }, 0);
    }
    cadastrar() {
        this.sucesso = null;
        if (this.formulario.valid) {
            const usuario = {
                nome: this.formulario.get('nome')?.value,
                email: this.formulario.get('email')?.value,
                login: this.formulario.get('login')?.value,
                password: this.formulario.get('senha')?.value,
                sector: this.formulario.get('setor')?.value,
                jobTitle: this.formulario.get('cargo')?.value,
                role: this.formulario.get('role')?.value || 'user',
                isActive: true
            };
            this.usuarioService.cadastrarUsuario(usuario).subscribe({
                next: (response) => {
                    this.sucesso = 'Usuário cadastrado com sucesso!';
                    console.log('Usuario cadastrado com sucesso: ', response);
                    this.abrirNotificacao({
                        titulo: 'Cadastro concluído',
                        mensagem: this.sucesso,
                        tipo: 'sucesso',
                        icon: ''
                    });
                    this.formulario.reset();
                    this.formulario.get('setor')?.setValue('');
                    this.formulario.get('cargo')?.setValue('');
                },
                error: (error) => {
                    console.error('Erro ao cadastrar usuário:', error);
                    if (error.status === 401) {
                        this.error = 'Login expirado. Por favor, faça login novamente.';
                        this.abrirNotificacao({
                            titulo: 'Erro',
                            mensagem: this.error,
                            tipo: 'erro',
                            icon: ''
                        });
                        setTimeout(() => {
                            this.sair();
                        }, 1000);
                    }
                    else if (error.status === 500 || error.status === 502 || error.status === 0) {
                        this.error = 'Desculpe, ocorreu um erro interno. Tente novamente mais tarde.';
                        this.abrirNotificacao({
                            titulo: 'Erro',
                            mensagem: this.error,
                            tipo: 'erro',
                            icon: ''
                        });
                    }
                    else {
                        this.abrirNotificacao({
                            titulo: 'Erro',
                            mensagem: error.error || 'Desculpe, ocorreu um erro ao tentar cadastrar um usuário, tente novamente mais tarde.',
                            tipo: 'erro',
                            icon: ''
                        });
                    }
                }
            });
        }
    }
    sair() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
};
CadastroFuncionarioComponent = __decorate([
    Component({
        selector: 'app-cadastro-funcionario',
        imports: [CommonModule, FormsModule, ReactiveFormsModule, MenuLateralComponent, NotificacaoComponent],
        templateUrl: './cadastro-funcionario.component.html',
        styleUrl: './cadastro-funcionario.component.css'
    })
], CadastroFuncionarioComponent);
export { CadastroFuncionarioComponent };
