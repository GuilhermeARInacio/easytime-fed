import { __decorate } from "tslib";
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
let ModalRelatorioComponent = class ModalRelatorioComponent {
    renderer;
    element;
    fecharModal = new EventEmitter();
    registros = [];
    usuario = '';
    dataInicio = '';
    dataFinal = '';
    constructor(renderer, element) {
        this.renderer = renderer;
        this.element = element;
    }
    fecharModalComEsc() {
        this.fecharModal.emit();
        this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', 'auto');
    }
    fechar() {
        this.fecharModal.emit();
        this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', 'auto');
    }
    exportarPDF() {
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
        const tableRows = [];
        array.forEach(item => {
            const rowData = [
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
    exportarExcel() {
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
        const worksheet = XLSX.utils.json_to_sheet(dados, { header: headers });
        const workbook = { Sheets: { [`Relatório de ${this.usuario}`]: worksheet }, SheetNames: [`Relatório de ${this.usuario}`] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const filename = `relatorio_${this.usuario}_${this.dataInicio}_${this.dataFinal}.xlsx`;
        saveAs(data, filename);
    }
};
__decorate([
    Output()
], ModalRelatorioComponent.prototype, "fecharModal", void 0);
__decorate([
    Input()
], ModalRelatorioComponent.prototype, "registros", void 0);
__decorate([
    Input()
], ModalRelatorioComponent.prototype, "usuario", void 0);
__decorate([
    Input()
], ModalRelatorioComponent.prototype, "dataInicio", void 0);
__decorate([
    Input()
], ModalRelatorioComponent.prototype, "dataFinal", void 0);
__decorate([
    HostListener("document:keydown.escape")
], ModalRelatorioComponent.prototype, "fecharModalComEsc", null);
ModalRelatorioComponent = __decorate([
    Component({
        selector: 'app-modal-relatorio',
        imports: [],
        templateUrl: './modal-relatorio.component.html',
        styleUrl: './modal-relatorio.component.css'
    })
], ModalRelatorioComponent);
export { ModalRelatorioComponent };
