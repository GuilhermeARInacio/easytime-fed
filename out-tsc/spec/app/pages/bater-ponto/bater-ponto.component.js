import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NotificacaoComponent } from "../../componentes/notificacao/notificacao.component";
import { MenuLateralComponent } from "../../componentes/menu-lateral/menu-lateral.component";
let BaterPontoComponent = class BaterPontoComponent {
    router;
    pontoService;
    popUpService;
    usuarioService;
    horarioAtual = '';
    intervalo;
    usuario = localStorage.getItem('login') || '';
    error = null;
    sucesso = null;
    constructor(router, pontoService, popUpService, usuarioService) {
        this.router = router;
        this.pontoService = pontoService;
        this.popUpService = popUpService;
        this.usuarioService = usuarioService;
    }
    ngOnInit() {
        if (!localStorage.getItem('token')) {
            this.router.navigate(['/login']);
        }
        this.atualizarHorario();
        this.intervalo = setInterval(() => {
            this.atualizarHorario();
        }, 1000);
    }
    baterPonto() {
        const ponto = {
            usuario: this.usuario,
            horarioAtual: this.horarioAtual
        };
        this.pontoService.baterPonto(ponto).subscribe({
            next: (response) => {
                console.log('Ponto registrado com sucesso:', response);
                this.error = null;
                this.popUpService.abrirNotificacao({
                    titulo: 'Registro de Ponto',
                    mensagem: 'Ponto registrado com sucesso às ' + response.horarioBatida + '.',
                    tipo: 'sucesso',
                    icon: ''
                });
            },
            error: (err) => {
                console.error('Erro ao bater ponto:', err);
                this.sucesso = null;
                if (err.status === 401) {
                    this.error = 'Login expirado. Por favor, faça login novamente.';
                    setInterval(() => {
                        this.sair();
                    }, 1000);
                }
                else if (err.status === 500 || err.status === 502 || err.status === 0) {
                    this.error = 'Desculpe, ocorreu um erro interno. Tente novamente mais tarde.';
                }
                else {
                    this.error = err.error || 'Erro ao bater ponto. Tente novamente mais tarde.';
                }
                this.popUpService.abrirNotificacao({
                    titulo: 'Erro',
                    mensagem: this.error || 'Erro ao bater ponto. Tente novamente mais tarde.',
                    tipo: 'erro',
                    icon: ''
                });
            }
        });
    }
    atualizarHorario() {
        const agora = new Date();
        this.horarioAtual = agora.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    sair() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }
};
BaterPontoComponent = __decorate([
    Component({
        selector: 'app-bater-ponto',
        imports: [CommonModule, NotificacaoComponent, MenuLateralComponent],
        templateUrl: './bater-ponto.component.html',
        styleUrl: './bater-ponto.component.css'
    })
], BaterPontoComponent);
export { BaterPontoComponent };
