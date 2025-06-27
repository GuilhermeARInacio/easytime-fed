import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRelatorioComponent } from './modal-relatorio.component';
import { RegistroPonto } from '../../interface/ponto/registro-ponto';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';

describe('ModalRelatorioComponent', () => {
  let component: ModalRelatorioComponent;
  let fixture: ComponentFixture<ModalRelatorioComponent>;

  beforeEach(async () => {
    spyOn(FileSaver, 'saveAs').and.stub();
    const jsPDFInstance = new jsPDF();
    spyOn(jsPDFInstance, 'save').and.stub();

    await TestBed.configureTestingModule({
      imports: [ModalRelatorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRelatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve emitir evento ao fechar modal', () => {
    spyOn(component.fecharModal, 'emit');
    component.fechar();
    expect(component.fecharModal.emit).toHaveBeenCalled();
  });

  it('deve chamar exportarPDF sem erros', () => {
    component.usuario = 'user';
    component.dataInicio = '2024-01-01';
    component.dataFinal = '2024-01-31';
    component.registros = [{
      login: 'user',
      data: '2024-01-01',
      entrada1: '08:00',
      saida1: '12:00',
      entrada2: '13:00',
      saida2: '17:00',
      entrada3: '',
      saida3: '',
      horasTrabalhadas: '8:00'
    } as RegistroPonto];

    const saveSpy = jasmine.createSpy();
    spyOn<any>(component, 'exportarPDF').and.callThrough();
    expect(() => component.exportarPDF()).not.toThrow();
  });

  it('deve chamar exportarExcel sem erros', () => {
    component.usuario = 'user';
    component.dataInicio = '2024-01-01';
    component.dataFinal = '2024-01-31';
    component.registros = [{
      login: 'user',
      data: '2024-01-01',
      entrada1: '08:00',
      saida1: '12:00',
      entrada2: '13:00',
      saida2: '17:00',
      entrada3: '',
      saida3: '',
      horasTrabalhadas: '8:00'
    } as RegistroPonto];

    spyOn<any>(component, 'exportarExcel').and.callThrough();
    expect(() => component.exportarExcel()).not.toThrow();
  });
});
