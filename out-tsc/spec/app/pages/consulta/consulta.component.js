import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { dataFinalAntesDeInicio, datasDepoisDeDataAtual } from '../../validators/custom-validators';
import { MenuLateralComponent } from "../../componentes/menu-lateral/menu-lateral.component";
import { NotificacaoComponent } from "../../componentes/notificacao/notificacao.component";
import { ModalRelatorioComponent } from "../../componentes/modal-relatorio/modal-relatorio.component";
import { CapitalizePipe } from "../../shared/capitalize.pipe";
import { ModalAlteracaoComponent } from "../../componentes/modal-alteracao/modal-alteracao.component";
let ConsultaComponent = class ConsultaComponent {
    formBuilder;
    pontoService;
    popUpService;
    router;
    renderer;
    element;
    formulario;
    registros = [];
    usuario = localStorage.getItem('login') || '';
    error = null;
    sucesso = null;
    shakeFields = {};
    carregando = false;
    modalExportar = false;
    modalAlteracao = false;
    registroAlteracao;
    pedidoAlteracao;
    constructor(formBuilder, pontoService, popUpService, router, renderer, element) {
        this.formBuilder = formBuilder;
        this.pontoService = pontoService;
        this.popUpService = popUpService;
        this.router = router;
        this.renderer = renderer;
        this.element = element;
    }
    ngOnInit() {
        if (!localStorage.getItem('token')) {
            this.router.navigate(['/login']);
        }
        this.formulario = this.formBuilder.group({
            inicio: ['', Validators.required],
            final: ['', Validators.required]
        }, {
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
        this.registros = [];
        if (this.formulario.valid) {
            const consultarRegistro = {
                login: localStorage.getItem('login') || '',
                dtInicio: this.formatarData(this.formulario.value.inicio),
                dtFinal: this.formatarData(this.formulario.value.final)
            };
            this.carregando = true;
            this.pontoService.consultarPonto(consultarRegistro).subscribe({
                next: (response) => {
                    setTimeout(() => {
                        this.registros = response;
                        console.log(response);
                        this.sucesso = 'Registros consultados com sucesso.';
                        this.popUpService.abrirNotificacao({
                            titulo: 'Consulta bem sucedida',
                            mensagem: this.sucesso,
                            tipo: 'sucesso',
                            icon: ''
                        });
                        this.carregando = false;
                        if (this.registros.length === 0) {
                            this.error = 'Nenhum registro encontrado para o período informado.';
                            this.carregando = false;
                        }
                    }, 1000);
                },
                error: (error) => {
                    if (error.status === 401) {
                        this.error = 'Login expirado. Por favor, faça login novamente.';
                        this.popUpService.abrirNotificacao({
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
                        this.error = 'Desculpe, ocorreu um erro interno ao tentar consultar os registros. Tente novamente mais tarde.';
                        this.popUpService.abrirNotificacao({
                            titulo: 'Erro',
                            mensagem: this.error,
                            tipo: 'erro',
                            icon: ''
                        });
                    }
                    setTimeout(() => {
                        if (error.error.includes('Nenhum ponto')) {
                            this.error = 'Não existem registros de ponto para o período informado.';
                            this.carregando = false;
                            return;
                        }
                        this.carregando = false;
                        this.error = error.error || 'Erro ao consultar registros.';
                    }, 500);
                }
            });
        }
        else {
            console.log('Formulário inválido:', this.formulario.errors);
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
        }
    }
    formatarData(data) {
        if (!data)
            return '';
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    formatarDataRetorno(data) {
        if (!data)
            return '';
        const [dia, mes, ano] = data.split('/');
        const anoCurto = ano.slice(-2); // pega os dois últimos dígitos
        return `${dia}/${mes}/${anoCurto}`;
    }
    sair() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }
    abrirModalExportar() {
        this.modalExportar = true;
        this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', 'hidden');
    }
    abrirModalAlteracao(registro) {
        this.registroAlteracao = registro;
        this.modalAlteracao = true;
        this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', 'hidden');
    }
    exibirAlteracao(registro) {
        this.pontoService.consultarAlteracao(registro.id).subscribe({
            next: (response) => {
                this.pedidoAlteracao = response;
                console.log(this.pedidoAlteracao);
            },
            error: (error) => {
                if (error.status === 401) {
                    this.error = 'Login expirado. Por favor, faça login novamente.';
                    this.popUpService.abrirNotificacao({
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
                    this.error = 'Desculpe, ocorreu um erro interno ao tentar consultar o registros. Tente novamente mais tarde.';
                    this.popUpService.abrirNotificacao({
                        titulo: 'Erro',
                        mensagem: this.error,
                        tipo: 'erro',
                        icon: ''
                    });
                }
                this.error = error.error;
                this.popUpService.abrirNotificacao({
                    titulo: 'Erro',
                    mensagem: this.error || 'Erro ao consultar pedido de alteração.',
                    tipo: 'erro',
                    icon: ''
                });
            }
        });
        this.modalAlteracao = true;
        this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', 'hidden');
    }
    statusClass(status) {
        switch (status.toUpperCase()) {
            case 'PENDENTE':
                return 'status-pendente';
            case 'APROVADO':
                return 'status-aprovado';
            case 'REJEITADO':
                return 'status-rejeitado';
            default:
                return '';
        }
    }
};
ConsultaComponent = __decorate([
    Component({
        selector: 'app-consulta',
        imports: [CommonModule, FormsModule, ReactiveFormsModule, MenuLateralComponent, NotificacaoComponent, ModalRelatorioComponent, CapitalizePipe, ModalAlteracaoComponent],
        templateUrl: './consulta.component.html',
        styleUrl: './consulta.component.css'
    })
], ConsultaComponent);
export { ConsultaComponent };
