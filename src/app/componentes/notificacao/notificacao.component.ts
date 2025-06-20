import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PopUpService } from '../../service/notificacao/pop-up.service';
import { Notificacao } from '../../interface/notificacao';

@Component({
  selector: 'app-notificacao',
  imports: [CommonModule],
  templateUrl: './notificacao.component.html',
  styleUrl: './notificacao.component.css',
   animations: [
    trigger('notificacaoAnimacao', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificacaoComponent {
  notificacao: Notificacao | null = null;
  visivel: boolean = false;

  constructor(private popUpService: PopUpService) {
  }

  ngOnInit() {
    this.popUpService.notificacao$.subscribe((notificacao) => {
      this.abrirNotificacao(notificacao);
    });
  }

  abrirNotificacao(notificacao: Notificacao) {
    this.visivel = true;
    if (notificacao.tipo === 'enviado') {
      this.notificacao = notificacao;
      this.notificacao.icon = 'send';

      document.documentElement.style.setProperty('--cor-fonte-notificacao', '#087120db'); 
      document.documentElement.style.setProperty('--cor-fundo-notificacao', '#d4f8d4');

    } else if (notificacao.tipo === 'erro') {
      notificacao.icon = 'warning';
      this.notificacao = notificacao

      document.documentElement.style.setProperty('--cor-fonte-notificacao', '#b00020'); 
      document.documentElement.style.setProperty('--cor-fundo-notificacao', '#ffebee');

    } else if (notificacao.tipo === 'sucesso') {
      this.notificacao = notificacao;
      this.notificacao.icon = 'check';

      document.documentElement.style.setProperty('--cor-fonte-notificacao', '#087120db'); 
      document.documentElement.style.setProperty('--cor-fundo-notificacao', '#d4f8d4');
    }

    setTimeout(() => {
        this.visivel = false;
      }, 5000);
  }

}
