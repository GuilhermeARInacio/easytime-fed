import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { NotificacaoComponent } from "../../componentes/notificacao/notificacao.component";
import { ModalAlteracaoComponent } from "../../componentes/modal-alteracao/modal-alteracao.component";
import { MenuLateralComponent } from "../../componentes/menu-lateral/menu-lateral.component";
import { CapitalizePipe } from "../../shared/capitalize.pipe";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { dataFinalAntesDeInicio, datasDepoisDeDataAtual } from '../../validators/custom-validators';
let ConsultaPedidosComponent = class ConsultaPedidosComponent {
    formBuilder;
    pontoService;
    popUpService;
    router;
    renderer;
    element;
    formulario;
    pedidos = [];
    usuario = localStorage.getItem('login') || '';
    error = null;
    sucesso = null;
    shakeFields = {};
    carregando = false;
    modalAlteracao = false;
    pedido;
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
            inicio: [''],
            final: [''],
            tipo: ['#'],
            status: ['#']
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
        this.formulario.get('status')?.valueChanges.subscribe(() => {
            this.error = null;
        });
        this.formulario.get('tipo')?.valueChanges.subscribe(() => {
            this.error = null;
        });
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
    consultar() {
        this.error = null;
        this.sucesso = null;
        this.shakeFields = {};
        this.pedidos = [];
        if (this.formulario.valid) {
            const inicio = this.formulario.value.inicio != '' ? this.formatarData(this.formulario.value.inicio) : null;
            const final = this.formulario.value.final != '' ? this.formatarData(this.formulario.value.final) : null;
            const status = this.formulario.value.status != '#' ? this.formulario.value.status : null;
            const tipo = this.formulario.value.tipo != '#' ? this.formulario.value.tipo : null;
            const filtroPedido = {
                dtInicio: inicio,
                dtFinal: final,
                status: status,
                tipo: tipo
            };
            this.carregando = true;
            this.pontoService.consultarPedidos(filtroPedido).subscribe({
                next: (response) => {
                    setTimeout(() => {
                        this.pedidos = response;
                        console.log(response);
                        this.sucesso = 'Pedidos consultados com sucesso.';
                        this.popUpService.abrirNotificacao({
                            titulo: 'Consulta bem sucedida',
                            mensagem: this.sucesso,
                            tipo: 'sucesso',
                            icon: ''
                        });
                        this.carregando = false;
                        if (this.pedidos.length === 0) {
                            this.error = 'Nenhum pedido encontrado.';
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
                        this.error = 'Desculpe, ocorreu um erro interno ao tentar consultar os pedidos. Tente novamente mais tarde.';
                        this.popUpService.abrirNotificacao({
                            titulo: 'Erro',
                            mensagem: this.error,
                            tipo: 'erro',
                            icon: ''
                        });
                    }
                    setTimeout(() => {
                        if (error.error.includes('Nenhum pedido')) {
                            this.error = 'Desculpe, não existem pedidos com essas características.';
                            this.carregando = false;
                            return;
                        }
                        this.carregando = false;
                        this.error = error.error || 'Erro ao consultar pedidos.';
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
    atualizarPedido(event) {
        const pedido = this.pedidos.find(p => p.id === event.id);
        if (pedido) {
            pedido.statusPedido = event.status;
        }
    }
    sair() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }
    formatarData(data) {
        if (!data)
            return '';
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    abrirModalAlteracao(pedido) {
        this.pedido = pedido;
        this.modalAlteracao = true;
        this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', 'hidden');
    }
};
ConsultaPedidosComponent = __decorate([
    Component({
        selector: 'app-consulta-pedidos',
        imports: [CommonModule, FormsModule, ReactiveFormsModule, MenuLateralComponent, NotificacaoComponent, CapitalizePipe, ModalAlteracaoComponent],
        templateUrl: './consulta-pedidos.component.html',
        styleUrl: './consulta-pedidos.component.css'
    })
], ConsultaPedidosComponent);
export { ConsultaPedidosComponent };
