import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
let PopUpService = class PopUpService {
    notificacao = null;
    constructor() { }
    notificacaoSubject = new Subject();
    notificacao$ = this.notificacaoSubject.asObservable();
    abrirNotificacao(notificacao) {
        this.notificacaoSubject.next(notificacao);
    }
};
PopUpService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], PopUpService);
export { PopUpService };
