import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { RegistroPonto } from '../../interface/ponto/registro-ponto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-modal-relatorio',
  imports: [],
  templateUrl: './modal-relatorio.component.html',
  styleUrl: './modal-relatorio.component.css'
})
export class ModalRelatorioComponent {
  
  @Output() fecharModal = new EventEmitter<void>();
  @Input() registros: RegistroPonto[] = [];
  @Input() usuario: string = '';
  @Input() dataInicio: string = '';
  @Input() dataFinal: string = '';
  
  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
  ) {}

  @HostListener("document:keydown.escape") fecharModalComEsc(){
    this.fecharModal.emit();
    this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', 'auto');
  }
  
  fechar() {
    this.fecharModal.emit();
    this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', 'auto');
  }

  exportarPDF(){
    const array = this.registros;
    const headers = [
      'Usuário', 
      'Data', 
      'Entrada',
      'Saída',
      'Entrada',
      'Saída',
      'Entrada',
      'Saída',
      'Status',
      'Horas Trabalhadas'
    ];
    const filename = 'relatorio_' + this.usuario + '_' + this.dataInicio + '_' + this.dataFinal + '.pdf';

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Relatório de ' + this.usuario, 10, 10);

    const tableColumn = headers;
    const tableRows: any[] = [];

    array.forEach(item => {
      const rowData: any[] = [
        item.login,
        item.data,   
        item.entrada1,
        item.saida1,  
        item.entrada2,
        item.saida2,  
        item.entrada3,
        item.saida3,
        item.status,
        item.horasTrabalhadas
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 9
      },
      headStyles: {
        fillColor: '#2979FF', 
        textColor: 255,            
        fontStyle: 'bold',
        halign: 'center'
      }
    });

    doc.save(filename);
  }

  exportarExcel(){
    const headers = [
      'Usuário', 
      'Data', 
      'Entrada_1',
      'Saída_1',
      'Entrada_2',
      'Saída_2',
      'Entrada_3',
      'Saída_3',
      'Status',
      'Horas Trabalhadas'
    ];

    const dados = this.registros.map(item => ({
      'Usuário': item.login,
      'Data': item.data,
      'Entrada_1': item.entrada1,
      'Saída_1': item.saida1,
      'Entrada_2': item.entrada2,
      'Saída_2': item.saida2,
      'Entrada_3': item.entrada3,
      'Saída_3': item.saida3,
      'Status': item.status,
      'Horas Trabalhadas': item.horasTrabalhadas
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dados, { header: headers });
    const workbook: XLSX.WorkBook = { Sheets: { [`Relatório de ${this.usuario}`]: worksheet }, SheetNames: [`Relatório de ${this.usuario}`] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const filename = `relatorio_${this.usuario}_${this.dataInicio}_${this.dataFinal}.xlsx`;
    saveAs(data, filename);
  }
}
