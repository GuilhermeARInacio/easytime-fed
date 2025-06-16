import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PopUpService } from '../../service/notificacao/pop-up.service';
import { RegistroPonto } from '../../interface/registro-ponto';
import { dataFinalAntesDeInicio, datasDepoisDeDataAtual } from '../../validators/custom-validators';
import { Router } from '@angular/router';
import { MenuLateralComponent } from "../../componentes/menu-lateral/menu-lateral.component";
import { PontoService } from '../../service/ponto/ponto.service';
import { NotificacaoComponent } from "../../componentes/notificacao/notificacao.component";
import { ModalRelatorioComponent } from "../../componentes/modal-relatorio/modal-relatorio.component";

@Component({
  selector: 'app-consulta',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MenuLateralComponent, NotificacaoComponent, ModalRelatorioComponent],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css'
})
export class ConsultaComponent {

  formulario!: FormGroup;
  registros: RegistroPonto[] = [];
  error: string | null = null;
  sucesso: string | null = null;
  shakeFields: { [key: string]: boolean } = {};
  carregando: boolean = false;
  modalExportar: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private pontoService: PontoService,
    private popUpService: PopUpService,
    private router: Router
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

  consultar() {
    this.error = null;
    this.sucesso = null;
    this.shakeFields = {};
    this.registros = [];

    if(this.formulario.valid){
      const consultarRegistro = {
        login: localStorage.getItem('login') || '',
        dtInicio: this.formatarData(this.formulario.value.inicio),
        dtFinal: this.formatarData(this.formulario.value.final)
      }

      this.carregando = true;

      this.pontoService.consultarPonto(consultarRegistro).subscribe({
        next: (response) => {
          setTimeout(() => {
            this.registros = response;

            this.sucesso = 'Registros consultados com sucesso.';
            this.popUpService.abrirNotificacao({
              titulo: 'Consulta bem sucedida',
              mensagem: this.sucesso,
              tipo: 'sucesso',
              icon: ''
            });

            this.carregando = false;

            if (this.registros.length === 0) {
              this.error = 'Nenhum registro encontrado para o período informado.';
              this.carregando = false;
            }
          }, 1000)
        },
        error: (error) => {
          if( error.status === 401) {
            this.error = 'Login expirado. Por favor, faça login novamente.';

            this.popUpService.abrirNotificacao({
              titulo: 'Erro',
              mensagem: 'Login expirado. Por favor, faça login novamente.',
              tipo: 'erro',
              icon: ''
            });

            setTimeout(() => {
              this.sair();
            }, 1000);
          }
          setTimeout(() => {
          if(error.error.includes('Nenhum ponto')){
              this.error = 'Não existem registros de ponto para o período informado.';
              this.carregando = false;
              return;
            }
            
            this.carregando = false;
            this.error = error.error || 'Erro ao consultar registros.';
          }, 500)
        }
      });
    } else {
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

  formatarData(data: string): string {
    if (!data) return '';

    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  formatarDataRetorno(data: string): string {
    if (!data) return '';

    const [dia, mes, ano] = data.split('/');
    const anoCurto = ano.slice(-2); // pega os dois últimos dígitos
    return `${dia}/${mes}/${anoCurto}`;
  }

  sair() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  
}
