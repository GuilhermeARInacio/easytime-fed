import { Notificacao } from '../../interface/notificacao';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  notificacao: Notificacao | null = null;

  constructor() { }

  private notificacaoSubject = new Subject<Notificacao>();
  private relatorioSubject = new Subject<any>();
  notificacao$ = this.notificacaoSubject.asObservable();

  abrirNotificacao(notificacao: Notificacao) {
    this.notificacaoSubject.next(notificacao);
  }

  abrirModalRelatorio() {
    this.relatorioSubject.next({});
  }
}
