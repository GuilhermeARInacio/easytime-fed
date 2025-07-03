import { Component, ElementRef, Renderer2 } from '@angular/core';
import { NotificacaoComponent } from "../../componentes/notificacao/notificacao.component";
import { ModalRelatorioComponent } from "../../componentes/modal-relatorio/modal-relatorio.component";
import { ModalAlteracaoComponent } from "../../componentes/modal-alteracao/modal-alteracao.component";
import { MenuLateralComponent } from "../../componentes/menu-lateral/menu-lateral.component";
import { CapitalizePipe } from "../../shared/capitalize.pipe";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlterarPonto } from '../../interface/ponto/alterar-ponto';
import { RegistroPonto } from '../../interface/ponto/registro-ponto';
import { Router } from '@angular/router';
import { PopUpService } from '../../service/notificacao/pop-up.service';
import { PontoService } from '../../service/ponto/ponto.service';
import { dataFinalAntesDeInicio, datasDepoisDeDataAtual } from '../../validators/custom-validators';

@Component({
  selector: 'app-consulta-pedidos',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MenuLateralComponent, NotificacaoComponent, ModalRelatorioComponent, CapitalizePipe, ModalAlteracaoComponent],
  templateUrl: './consulta-pedidos.component.html',
  styleUrl: './consulta-pedidos.component.css'
})
export class ConsultaPedidosComponent {

  formulario!: FormGroup;
  registros: RegistroPonto[] = [];
  usuario: string = localStorage.getItem('login') || '';
  error: string | null = null;
  sucesso: string | null = null;
  shakeFields: { [key: string]: boolean } = {};
  carregando: boolean = false;
  modalExportar: boolean = false;

  modalAlteracao: boolean = false;
  registroAlteracao: RegistroPonto | undefined;
  pedidoAlteracao: AlterarPonto | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private pontoService: PontoService,
    private popUpService: PopUpService,
    private router: Router,
    private renderer: Renderer2,
    private element: ElementRef
  ){}

  ngOnInit() {
    if(!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }

    this.formulario = this.formBuilder.group({
      inicio: ['', Validators.required],
      final: ['', Validators.required]
    },
    {    
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

}
