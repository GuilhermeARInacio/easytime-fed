import { Notificacao } from './../../interface/notificacao';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  notificacao: Notificacao | null = null;

  constructor() { }

  private notificacaoSubject = new Subject<Notificacao>();
  notificacao$ = this.notificacaoSubject.asObservable();

  abrirNotificacao(notificacao: Notificacao) {
    this.notificacaoSubject.next(notificacao);
  }
}
