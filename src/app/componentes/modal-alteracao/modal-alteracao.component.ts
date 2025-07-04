import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2  } from '@angular/core';
import { RegistroPonto } from '../../interface/ponto/registro-ponto';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PontoService } from '../../service/ponto/ponto.service';
import { CommonModule, NgIf } from '@angular/common';
import { PopUpService } from '../../service/notificacao/pop-up.service';
import { AlterarPonto } from '../../interface/ponto/alterar-ponto';
import { horarioForaComercial, horarioSaidaAnteriorEntrada } from '../../validators/custom-validators';
import { PedidoPonto } from '../../interface/ponto/pedido-ponto';

@Component({
  selector: 'app-modal-alteracao',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-alteracao.component.html',
  styleUrl: './modal-alteracao.component.css'
})
export class ModalAlteracaoComponent {

  @Output() fecharModal = new EventEmitter<void>();
  @Output() pedidoAtualizado = new EventEmitter<{ id: number, status: string }>();
  @Input() usuario = '';
  @Input() registro: RegistroPonto | undefined;
  @Input() pedidoAlteracao: AlterarPonto | undefined;
  @Input() pedido: PedidoPonto | undefined;
  formulario!: FormGroup;
  shakeFields: { [key: string]: boolean } = {};
  error: string | null = null;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    private pontoService: PontoService,
    private notificacaoService: PopUpService
  ) {}

  ngOnChanges(){
    console.log("Registro: " + this.registro);
    console.log("Pedido de alteracao: " + this.pedidoAlteracao);
    console.log("Informações do pedido: " + this.pedido);

    if(this.registro){
      this.formulario = this.formBuilder.group({
        entrada1: [this.registro?.entrada1 || '', Validators.compose([
          Validators.required,
          horarioForaComercial
        ])],
        saida1: [this.registro?.saida1 || '', Validators.compose([
          Validators.required,
          horarioForaComercial
        ])],
        entrada2: [this.registro?.entrada2 || '', Validators.compose([
          horarioForaComercial
        ])],
        saida2: [this.registro?.saida2 || '', Validators.compose([
          horarioForaComercial
        ])],
        entrada3: [this.registro?.entrada3 || '', Validators.compose([
          horarioForaComercial
        ])],
        saida3: [this.registro?.saida3 || '', Validators.compose([
          horarioForaComercial
        ])],
        justificativa: ['', Validators.required]
      },
      {
        validators: horarioSaidaAnteriorEntrada()
      }
    );

      this.formulario.get('entrada1')?.valueChanges.subscribe(() => {
        this.shakeFields['entrada1'] = false;
      });
      this.formulario.get('saida1')?.valueChanges.subscribe(() => {
        this.shakeFields['saida1'] = false;
      });
      this.formulario.get('entrada2')?.valueChanges.subscribe(() => {
        this.shakeFields['entrada2'] = false;
      });
      this.formulario.get('saida2')?.valueChanges.subscribe(() => {
        this.shakeFields['saida2'] = false;
      });
      this.formulario.get('entrada3')?.valueChanges.subscribe(() => {
        this.shakeFields['entrada3'] = false;
      });
      this.formulario.get('saida3')?.valueChanges.subscribe(() => {
        this.shakeFields['saida3'] = false;
      });
      this.formulario.get('justificativa')?.valueChanges.subscribe(() => {
        this.shakeFields['justificativa'] = false;
      });
    } else if (this.pedido){
      if(this.pedido.alteracaoPonto){
        this.formulario = this.formBuilder.group({
          entrada1: [this.pedido?.alteracaoPonto.entrada1],
          saida1: [this.pedido?.alteracaoPonto.saida1],
          entrada2: [this.pedido?.alteracaoPonto.entrada2],
          saida2: [this.pedido?.alteracaoPonto.saida2],
          entrada3: [this.pedido?.alteracaoPonto.entrada3],
          saida3: [this.pedido?.alteracaoPonto.saida3],
          justificativa: [this.pedido?.alteracaoPonto.justificativa]
        });

        this.formulario.disable();
      } else {
        this.formulario = this.formBuilder.group({
          entrada1: [this.pedido?.registroPonto.entrada1],
          saida1: [this.pedido?.registroPonto.saida1],
          entrada2: [this.pedido?.registroPonto.entrada2],
          saida2: [this.pedido?.registroPonto.saida2],
          entrada3: [this.pedido?.registroPonto.entrada3],
          saida3: [this.pedido?.registroPonto.saida3],
          justificativa: ['']
        });

        this.formulario.disable();
      }
    } else {
      this.formulario = this.formBuilder.group({
        entrada1: [this.pedidoAlteracao?.entrada1],
        saida1: [this.pedidoAlteracao?.saida1],
        entrada2: [this.pedidoAlteracao?.entrada2],
        saida2: [this.pedidoAlteracao?.saida2],
        entrada3: [this.pedidoAlteracao?.entrada3],
        saida3: [this.pedidoAlteracao?.saida3],
        justificativa: [this.pedidoAlteracao?.justificativa]
      });
      this.formulario.disable();
    }
  }

  @HostListener("document:keydown.escape") fecharModalComEsc(){
    this.registro = undefined;
    this.pedidoAlteracao = undefined;
    this.pedido = undefined

    this.fecharModal.emit();
    this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', 'auto');
  }

  fechar() {
    this.registro = undefined;
    this.pedidoAlteracao = undefined;
    this.pedido = undefined

    this.fecharModal.emit();
    this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', 'auto');
  }

  enviarAlteracao(){
    if (this.formulario.valid) {
      console.log("Formulario valido")
      if (this.registro?.id === undefined) {
        this.notificacaoService.abrirNotificacao({
          titulo: 'Erro',
          mensagem: 'ID do registro não encontrado. Tente novamente.',
          tipo: 'erro',
          icon: 'error'
        });
        return;
      }
      const dadosAlteracao: AlterarPonto = {
        login: localStorage.getItem('login') || '',
        idPonto: this.registro.id,
        data: this.registro?.data || '',
        entrada1: this.formulario.get('entrada1')?.value,
        saida1: this.formulario.get('saida1')?.value,
        entrada2: this.formulario.get('entrada2')?.value,
        saida2: this.formulario.get('saida2')?.value,
        entrada3: this.formulario.get('entrada3')?.value,
        saida3: this.formulario.get('saida3')?.value,
        justificativa: this.formulario.get('justificativa')?.value || '',
        status: null
      };
      this.pontoService.alterarRegistro(dadosAlteracao).subscribe({
        next: (response) => {
          this.notificacaoService.abrirNotificacao({
            titulo: 'Pedido enviado com sucesso',
            mensagem: 'O pedido de alteração foi enviado com sucesso, aguarde a validação do gestor.',
            tipo: 'sucesso',
            icon: 'check_circle'
          });
        
          this.error = null;

          setTimeout(() => {
            this.formulario.reset();
            this.fechar();
          }, 1000);
      },
      error: (err) => {
        console.error('Erro ao alterar registro:', err);
        
        if (err.status === 401 || err.status === 403) {
          this.error = 'Você não tem permissão para alterar este registro. Verifique suas credenciais.';
        } else if (err.status === 500 || err.status === 502 || err.status === 0) {
          this.error = 'Desculpe, ocorreu um erro interno ao tentar alterar o registro. Tente novamente mais tarde.';
        } else {
          this.error = err.error || 'Erro ao alterar registro. Tente novamente mais tarde.';
        }

        this.notificacaoService.abrirNotificacao({
          titulo: 'Erro',
          mensagem: this.error || 'Erro ao alterar registro. Tente novamente mais tarde.',
          tipo: 'erro',
          icon: 'error'
        });
      }});
    } else {
      console.log("Formulario invalido")
      this.formulario.markAllAsTouched();

      Object.keys(this.formulario.controls).forEach((controlName) => {
        const control = this.formulario.get(controlName);
        if (control?.invalid) {
          this.shakeFields[controlName] = true;
          setTimeout(() => {
            this.shakeFields[controlName] = false;
          }, 300);
        }
      })
    }
  }

  statusClass(status: string): string {
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

  recusarPedido(){
      if (this.pedido?.id === undefined) {
        this.notificacaoService.abrirNotificacao({
          titulo: 'Erro',
          mensagem: 'ID do pedido não encontrado. Tente novamente.',
          tipo: 'erro',
          icon: 'error'
        });
        return;
      }

      this.pontoService.recusarPedido(this.pedido.id).subscribe({
        next: (response) => {
          this.notificacaoService.abrirNotificacao({
            titulo: 'Pedido recusado com sucesso',
            mensagem: 'O pedido de alteração foi recusado com sucesso.',
            tipo: 'sucesso',
            icon: 'check_circle'
          });
        
          this.error = null;
          this.pedidoAtualizado.emit({ id: this.pedido!.id, status: 'REJEITADO' });

          setTimeout(() => {
            this.formulario.reset();
            this.fechar();
          }, 1000);
      },
      error: (err) => {
        console.error('Erro ao recusar pedido:', err);
        
        if (err.status === 401 || err.status === 403) {
          this.error = 'Você não tem permissão para recusar este pedido. Verifique suas credenciais.';
        } else if (err.status === 500 || err.status === 502 || err.status === 0) {
          this.error = 'Desculpe, ocorreu um erro interno ao tentar recusar o pedido. Tente novamente mais tarde.';
        } else {
          this.error = err.error || 'Erro ao recusar pedido. Tente novamente mais tarde.';
        }

        this.notificacaoService.abrirNotificacao({
          titulo: 'Erro',
          mensagem: this.error || 'Erro ao recusar pedido. Tente novamente mais tarde.',
          tipo: 'erro',
          icon: 'error'
        });
      }});
  }

  aceitarPedido(){
    if (this.pedido?.id === undefined) {
        this.notificacaoService.abrirNotificacao({
          titulo: 'Erro',
          mensagem: 'ID do pedido não encontrado. Tente novamente.',
          tipo: 'erro',
          icon: 'error'
        });
        return;
      }

      this.pontoService.aceitarPedido(this.pedido.id).subscribe({
        next: (response) => {
          this.notificacaoService.abrirNotificacao({
            titulo: 'Pedido aprovado com sucesso',
            mensagem: 'O pedido de alteração foi aprovado com sucesso.',
            tipo: 'sucesso',
            icon: 'check_circle'
          });
        
          this.error = null;
          this.pedidoAtualizado.emit({ id: this.pedido!.id, status: 'APROVADO' });

          setTimeout(() => {
            this.formulario.reset();
            this.fechar();
          }, 1000);
      },
      error: (err) => {
        console.error('Erro ao aprovar pedido:', err);
        
        if (err.status === 401 || err.status === 403) {
          this.error = 'Você não tem permissão para aprovar este pedido. Verifique suas credenciais.';
        } else if (err.status === 500 || err.status === 502 || err.status === 0) {
          this.error = 'Desculpe, ocorreu um erro interno ao tentar aprovar o pedido. Tente novamente mais tarde.';
        } else {
          this.error = err.error || 'Erro ao aprovar pedido. Tente novamente mais tarde.';
        }

        this.notificacaoService.abrirNotificacao({
          titulo: 'Erro',
          mensagem: this.error || 'Erro ao aprovar pedido. Tente novamente mais tarde.',
          tipo: 'erro',
          icon: 'error'
        });
      }});
  }
}
