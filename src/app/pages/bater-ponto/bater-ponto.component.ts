import { PopUpService } from '../../service/notificacao/pop-up.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PontoService } from '../../service/ponto/ponto.service';
import { NotificacaoComponent } from "../../componentes/notificacao/notificacao.component";
import { UsuarioService } from '../../service/usuario/usuario.service';
import { MenuLateralComponent } from "../../componentes/menu-lateral/menu-lateral.component";

@Component({
  selector: 'app-bater-ponto',
  imports: [CommonModule, NotificacaoComponent, MenuLateralComponent],
  templateUrl: './bater-ponto.component.html',
  styleUrl: './bater-ponto.component.css'
})
export class BaterPontoComponent {
  horarioAtual: string = '';
  intervalo: any;

  error: string | null = null;
  sucesso: string | null = null;

  constructor(
    private router : Router,
    private pontoService: PontoService,
    private popUpService: PopUpService,
    private usuarioService: UsuarioService
  ){}

  ngOnInit() {
    if(!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }

    this.atualizarHorario();
    this.intervalo = setInterval(() => {
      this.atualizarHorario();
    }, 1000);
  }

  baterPonto(){
    const ponto = {
      horarioAtual: this.horarioAtual
    }
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
          } else if (err.status === 500) {
            this.error = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
          } else {
            this.error = err.error || 'Erro ao bater ponto. Tente novamente mais tarde.';
          }

          this.popUpService.abrirNotificacao({
            titulo: 'Erro',
            mensagem: this.error ?? 'Erro ao bater ponto. Tente novamente mais tarde.',
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

  sair(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
