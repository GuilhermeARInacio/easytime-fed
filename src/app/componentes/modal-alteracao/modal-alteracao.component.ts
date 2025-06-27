import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2  } from '@angular/core';
import { RegistroPonto } from '../../interface/ponto/registro-ponto';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PontoService } from '../../service/ponto/ponto.service';
import { CommonModule } from '@angular/common';
import { PopUpService } from '../../service/notificacao/pop-up.service';
import { AlterarPonto } from '../../interface/ponto/alterar-ponto';
import { horarioForaComercial, horarioSaidaAnteriorEntrada } from '../../validators/custom-validators';

@Component({
  selector: 'app-modal-alteracao',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-alteracao.component.html',
  styleUrl: './modal-alteracao.component.css'
})
export class ModalAlteracaoComponent {

  @Output() fecharModal = new EventEmitter<void>();
  @Input() usuario = '';
  @Input() registro: RegistroPonto | undefined;
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

  ngOnInit(){
    console.log(this.registro)
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
  }

  @HostListener("document:keydown.escape") fecharModalComEsc(){
    this.fecharModal.emit();
    this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', 'auto');
  }

  fechar() {
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
        idPonto: this.registro.id,
        data: this.registro?.data || '',
        entrada1: this.formulario.get('entrada1')?.value,
        saida1: this.formulario.get('saida1')?.value,
        entrada2: this.formulario.get('entrada2')?.value,
        saida2: this.formulario.get('saida2')?.value,
        entrada3: this.formulario.get('entrada3')?.value,
        saida3: this.formulario.get('saida3')?.value,
        justificativa: this.formulario.get('justificativa')?.value || ''
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
        } else if (err.status === 500) {
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

}
