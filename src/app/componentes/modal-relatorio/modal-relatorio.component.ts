import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RegistroPonto } from '../../interface/registro-ponto';

@Component({
  selector: 'app-modal-relatorio',
  imports: [],
  templateUrl: './modal-relatorio.component.html',
  styleUrl: './modal-relatorio.component.css'
})
export class ModalRelatorioComponent {
  
  @Output() fecharModal = new EventEmitter<void>();
  @Input() registros: RegistroPonto[] = [];
  
  constructor() {}
  
  fechar() {
    this.fecharModal.emit();
  }

  exportarPDF(){
    console.log('Exportar PDF');
    console.log(this.registros);
  }

  exportarExcel(){
    console.log('Exportar Excel');
    console.log(this.registros);
  }
}
