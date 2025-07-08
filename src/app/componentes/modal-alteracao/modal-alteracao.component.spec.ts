import { PopUpService } from './../../service/notificacao/pop-up.service';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ModalAlteracaoComponent } from './modal-alteracao.component';
import { PontoService } from '../../service/ponto/ponto.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ElementRef, Renderer2 } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('ModalAlteracaoComponent', () => {
  let component: ModalAlteracaoComponent;
  let fixture: ComponentFixture<ModalAlteracaoComponent>;
  let pontoServiceSpy: jasmine.SpyObj<PontoService>;
  let popUpServiceSpy: jasmine.SpyObj<PopUpService>;

  const registro = {
    id: 1,
    data: '27/06/2025',
    entrada1: '08:00',
    saida1: '12:00',
    entrada2: '13:00',
    saida2: '18:00',
    entrada3: '',
    saida3: '',
    justificativa: ''
  }

  beforeEach(async () => {
    pontoServiceSpy = jasmine.createSpyObj('PontoService', ['alterarRegistro', 'recusarPedido', 'aceitarPedido']);
    popUpServiceSpy = jasmine.createSpyObj('PopUpService', ['abrirNotificacao']);   

    await TestBed.configureTestingModule({
      imports: [ModalAlteracaoComponent, ReactiveFormsModule],
      providers: [
        { provide: PontoService, useValue: pontoServiceSpy },
        { provide: PopUpService, useValue: popUpServiceSpy }
      ]
    })
    .overrideComponent(ModalAlteracaoComponent, {
      set: { template: '<div></div>' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAlteracaoComponent);
    component = fixture.componentInstance;
    component.registro = registro as any;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com valores do registro', () => {
    component.ngOnChanges();
    expect(component.formulario.value.entrada1).toBe('08:00');
    expect(component.formulario.value.saida1).toBe('12:00');
    expect(component.formulario.value.entrada2).toBe('13:00');
    expect(component.formulario.value.saida2).toBe('18:00');
  });

  it('deve inicializar o formulário sem valores do registro', () => {
    component.registro = {
      id: 1,
      login: 'user',
      data: '27/06/2025',
      horasTrabalhadas: '',
      entrada1: '',
      saida1: '',
      entrada2: '',
      saida2: '',
      entrada3: '',
      saida3: '',
      status: 'PENDENTE',
      temAlteracao: false
    };
    component.ngOnChanges();
    expect(component.formulario.value.entrada1).toBe('');
    expect(component.formulario.value.saida1).toBe('');
    expect(component.formulario.value.entrada2).toBe('');
    expect(component.formulario.value.saida2).toBe('');
  });

  it('deve inicializar o formulário com pedido alteração se registro estiver undefined', () => {
    component.registro = undefined;
    component.pedido = undefined;
    component.pedidoAlteracao = {
      login: 'user',
      idPonto: 1,
      data: '27/06/2025',
      entrada1: '08:00',
      saida1: '12:00',
      entrada2: '13:00',
      saida2: '17:00',
      entrada3: '',
      saida3: '',
      justificativa: 'justificativa',
      status: 'PENDENTE',
    };
    component.ngOnChanges();
    expect(component.formulario.value.entrada1).toBe('08:00');
    expect(component.formulario.value.saida1).toBe('12:00');
    expect(component.formulario.value.entrada2).toBe('13:00');
    expect(component.formulario.value.saida2).toBe('17:00');
    expect(component.formulario.value.justificativa).toBe('justificativa');
  });

  it('deve inicializar o formulário com alterção se tiver pedido', () => {
    component.registro = undefined;
    component.pedido = {
      id: 1,
      login: 'user',
      idPonto: 1,
      dataRegistro: '01/02/2025',
      tipoPedido: 'ALTERACAO',
      dataPedido: '02/02/2025',
      statusRegistro: 'PENDENTE',
      statusPedido: 'PENDENTE',
      alteracaoPonto: {
        entrada1: '08:00',
        saida1: '12:00',
        entrada2: '13:00',
        saida2: '17:00',
        entrada3: '',
        saida3: '',
        justificativa: 'Tive uma reunião inesperada'
      },
      registroPonto: {
        id: 1,
        login: 'user',
        data: '01/02/2025',
        horasTrabalhadas: '8h',
        entrada1: '08:00',
        saida1: '12:00',
        entrada2: '13:00',
        saida2: '18:00',
        entrada3: '',
        saida3: '',
        status: 'PENDENTE',
        temAlteracao: true
      }
    };
    component.pedidoAlteracao = undefined;
    component.ngOnChanges();
    expect(component.formulario.value.entrada1).toBe('08:00');
    expect(component.formulario.value.saida1).toBe('12:00');
    expect(component.formulario.value.entrada2).toBe('13:00');
    expect(component.formulario.value.saida2).toBe('17:00');
    expect(component.formulario.value.justificativa).toBe('Tive uma reunião inesperada');
  });

  it('deve inicializar o formulário com registro se tiver pedido e não tiver alteração', () => {
    component.registro = undefined;
    component.pedido = {
      id: 1,
      login: 'user',
      idPonto: 1,
      dataRegistro: '01/02/2025',
      tipoPedido: 'REGISTRO',
      dataPedido: '01/02/2025',
      statusRegistro: 'PENDENTE',
      statusPedido: 'PENDENTE',
      alteracaoPonto: null,
      registroPonto: {
        id: 1,
        login: 'user',
        data: '01/02/2025',
        horasTrabalhadas: '8h',
        entrada1: '08:00',
        saida1: '12:00',
        entrada2: '13:00',
        saida2: '18:00',
        entrada3: '',
        saida3: '',
        status: 'PENDENTE',
        temAlteracao: true
      }
    };
    component.pedidoAlteracao = undefined;
    component.ngOnChanges();
    expect(component.formulario.value.entrada1).toBe('08:00');
    expect(component.formulario.value.saida1).toBe('12:00');
    expect(component.formulario.value.entrada2).toBe('13:00');
    expect(component.formulario.value.saida2).toBe('18:00');
    expect(component.formulario.value.justificativa).toBe('');
  });

  it('deve chamar pontoService.recusarPedido e abrir notificação de sucesso ao recusar pedido válido', () => {
    component.pedido = {
      id: 1,
      login: 'user',
      idPonto: 1,
      dataRegistro: '01/02/2025',
      tipoPedido: 'REGISTRO',
      dataPedido: '01/02/2025',
      statusRegistro: 'PENDENTE',
      statusPedido: 'PENDENTE',
      alteracaoPonto: null,
      registroPonto: {
        id: 1,
        login: 'user',
        data: '01/02/2025',
        horasTrabalhadas: '8h',
        entrada1: '08:00',
        saida1: '12:00',
        entrada2: '13:00',
        saida2: '18:00',
        entrada3: '',
        saida3: '',
        status: 'PENDENTE',
        temAlteracao: true
      }
    };
    const response = 'Pedido recusado com sucesso.';

    pontoServiceSpy.recusarPedido.and.returnValue(of(response));

    component.recusarPedido();

    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
  });

  it('deve abrir notificação de erro se id estiver undefined', () => {
    component.recusarPedido();

    expect(pontoServiceSpy.recusarPedido).not.toHaveBeenCalled();
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
  });

  it('recusarPedido deve tratar erro 401', () => {
    component.pedido = {
      id: 1,
      login: 'user',
      idPonto: 1,
      dataRegistro: '01/02/2025',
      tipoPedido: 'REGISTRO',
      dataPedido: '01/02/2025',
      statusRegistro: 'PENDENTE',
      statusPedido: 'PENDENTE',
      alteracaoPonto: null,
      registroPonto: null
    };

    pontoServiceSpy.recusarPedido.and.returnValue(throwError(() => ({ status: 401, error: 'Usuário não autorizado' })));

    component.recusarPedido();

    expect(component.error).toBe('Você não tem permissão para recusar este pedido. Verifique suas credenciais.');
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
  });

  it('recusarPedido deve tratar erro 500', () => {
    component.pedido = {
      id: 1,
      login: 'user',
      idPonto: 1,
      dataRegistro: '01/02/2025',
      tipoPedido: 'REGISTRO',
      dataPedido: '01/02/2025',
      statusRegistro: 'PENDENTE',
      statusPedido: 'PENDENTE',
      alteracaoPonto: null,
      registroPonto: null
    };

    pontoServiceSpy.recusarPedido.and.returnValue(throwError(() => ({ status: 500, error: 'Serve error' })));

    component.recusarPedido();

    expect(component.error).toBe('Desculpe, ocorreu um erro interno ao tentar recusar o pedido. Tente novamente mais tarde.');
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
  });

  it('recusarPedido deve tratar erro 400', () => {
    component.pedido = {
      id: 1,
      login: 'user',
      idPonto: 1,
      dataRegistro: '01/02/2025',
      tipoPedido: 'REGISTRO',
      dataPedido: '01/02/2025',
      statusRegistro: 'PENDENTE',
      statusPedido: 'PENDENTE',
      alteracaoPonto: null,
      registroPonto: null
    };

    pontoServiceSpy.recusarPedido.and.returnValue(throwError(() => ({ status: 400, error: null })));

    component.recusarPedido();

    expect(component.error).toBe('Erro ao recusar pedido. Tente novamente mais tarde.');
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
  });

  it('deve chamar pontoService.aceitarPedido e abrir notificação de sucesso ao aprovar pedido válido', () => {
    component.pedido = {
      id: 1,
      login: 'user',
      idPonto: 1,
      dataRegistro: '01/02/2025',
      tipoPedido: 'REGISTRO',
      dataPedido: '01/02/2025',
      statusRegistro: 'PENDENTE',
      statusPedido: 'PENDENTE',
      alteracaoPonto: null,
      registroPonto: {
        id: 1,
        login: 'user',
        data: '01/02/2025',
        horasTrabalhadas: '8h',
        entrada1: '08:00',
        saida1: '12:00',
        entrada2: '13:00',
        saida2: '18:00',
        entrada3: '',
        saida3: '',
        status: 'PENDENTE',
        temAlteracao: true
      }
    };
    const response = 'Pedido recusado com sucesso.';

    pontoServiceSpy.aceitarPedido.and.returnValue(of(response));

    component.aceitarPedido();

    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
  });

  it('deve abrir notificação de erro se id estiver undefined', () => {
    component.aceitarPedido();

    expect(pontoServiceSpy.aceitarPedido).not.toHaveBeenCalled();
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
  });

  it('aceitarPedido deve tratar erro 401', () => {
    component.pedido = {
      id: 1,
      login: 'user',
      idPonto: 1,
      dataRegistro: '01/02/2025',
      tipoPedido: 'REGISTRO',
      dataPedido: '01/02/2025',
      statusRegistro: 'PENDENTE',
      statusPedido: 'PENDENTE',
      alteracaoPonto: null,
      registroPonto: null
    };

    pontoServiceSpy.aceitarPedido.and.returnValue(throwError(() => ({ status: 401, error: 'Usuário não autorizado' })));

    component.aceitarPedido();

    expect(component.error).toBe('Você não tem permissão para aprovar este pedido. Verifique suas credenciais.');
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
  });

  it('aceitarPedido deve tratar erro 500', () => {
    component.pedido = {
      id: 1,
      login: 'user',
      idPonto: 1,
      dataRegistro: '01/02/2025',
      tipoPedido: 'REGISTRO',
      dataPedido: '01/02/2025',
      statusRegistro: 'PENDENTE',
      statusPedido: 'PENDENTE',
      alteracaoPonto: null,
      registroPonto: null
    };

    pontoServiceSpy.aceitarPedido.and.returnValue(throwError(() => ({ status: 500, error: 'Serve error' })));

    component.aceitarPedido();

    expect(component.error).toBe('Desculpe, ocorreu um erro interno ao tentar aprovar o pedido. Tente novamente mais tarde.');
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
  });

  it('aceitarPedido deve tratar erro 400', () => {
    component.pedido = {
      id: 1,
      login: 'user',
      idPonto: 1,
      dataRegistro: '01/02/2025',
      tipoPedido: 'REGISTRO',
      dataPedido: '01/02/2025',
      statusRegistro: 'PENDENTE',
      statusPedido: 'PENDENTE',
      alteracaoPonto: null,
      registroPonto: null
    };

    pontoServiceSpy.aceitarPedido.and.returnValue(throwError(() => ({ status: 400, error: null })));

    component.aceitarPedido();

    expect(component.error).toBe('Erro ao aprovar pedido. Tente novamente mais tarde.');
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
  });
  
  it('deve emitir fecharModal ao chamar fechar()', () => {
    spyOn(component.fecharModal, 'emit');
    component.fechar();
    expect(component.fecharModal.emit).toHaveBeenCalled();
  });

  it('deve emitir fecharModal ao pressionar ESC', () => {
    spyOn(component.fecharModal, 'emit');
    component.fecharModalComEsc();
    expect(component.fecharModal.emit).toHaveBeenCalled();
  });

  it('deve chamar pontoService.alterarRegistro e abrir notificação de sucesso ao enviar alteração válida', fakeAsync(() => {
    component.ngOnChanges();
    component.formulario.patchValue({
      entrada1: '08:00',
      saida1: '12:00',
      entrada2: '13:00',
      saida2: '18:00',
      entrada3: '',
      saida3: '',
      justificativa: 'Teste'
    });
    pontoServiceSpy.alterarRegistro.and.returnValue(of('Registro de ponto atualizado com sucesso.'));
    spyOn(component, 'fechar');

    component.enviarAlteracao();
    tick(1000);

    expect(pontoServiceSpy.alterarRegistro).toHaveBeenCalled();
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
      titulo: 'Pedido enviado com sucesso'
    }));
    expect(component.fechar).toHaveBeenCalled();
  }));

  it('deve abrir notificação de erro se registro.id for undefined', () => {
    component.ngOnChanges();
    component.registro = { ...registro, id: undefined } as any;
    component.formulario.patchValue({ justificativa: 'Teste' });
    component.enviarAlteracao();
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
      titulo: 'Erro'
    }));
  });

  it('deve tratar erro 500', () => {
    component.ngOnChanges();
    component.formulario.patchValue({
      entrada1: '08:00',
      saida1: '12:00',
      entrada2: '13:00',
      saida2: '18:00',
      entrada3: '',
      saida3: '',
      justificativa: 'Teste'
    });
    pontoServiceSpy.alterarRegistro.and.returnValue(throwError({ status: 500, error: null }));

    component.enviarAlteracao();

    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
      titulo: 'Erro'
    }));
    expect(component.error).toBe('Desculpe, ocorreu um erro interno ao tentar alterar o registro. Tente novamente mais tarde.');
  });

  it('deve definir mensagem de erro especifica se erro 401 ou 403', () => {
    component.ngOnChanges();
    component.formulario.patchValue({
      entrada1: '08:00',
      saida1: '12:00',
      entrada2: '13:00',
      saida2: '18:00',
      entrada3: '',
      saida3: '',
      justificativa: 'Teste'
    });
    pontoServiceSpy.alterarRegistro.and.returnValue(throwError({ status: 401, error: 'Usuário não autorizado' }));

    component.enviarAlteracao();

    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
      titulo: 'Erro'
    }));
    expect(component.error).toBe('Você não tem permissão para alterar este registro. Verifique suas credenciais.');
  });

  it('deve definir mensagem de erro especifica se erro for diferente de 500, 401 ou 403 e err.error nulo', () => {
    component.ngOnChanges();
    component.formulario.patchValue({
      entrada1: '08:00',
      saida1: '12:00',
      entrada2: '13:00',
      saida2: '18:00',
      entrada3: '',
      saida3: '',
      justificativa: 'Teste'
    });
    pontoServiceSpy.alterarRegistro.and.returnValue(throwError({ status: 400, error: null }));

    component.enviarAlteracao();

    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
      titulo: 'Erro'
    }));
    expect(component.error).toBe('Erro ao alterar registro. Tente novamente mais tarde.');
  });

  it('deve marcar campos como touched e ativar shakeFields se formulário for inválido, e desativar após 300ms', fakeAsync(() => {
    component.ngOnChanges();
    component.formulario.patchValue({
      entrada1: '',
      saida1: '',
      entrada2: '',
      saida2: '',
      entrada3: '',
      saida3: '',
      justificativa: ''
    });
    spyOn(component.formulario, 'markAllAsTouched').and.callThrough();
    component.enviarAlteracao();
    expect(component.formulario.markAllAsTouched).toHaveBeenCalled();
    expect(component.shakeFields['entrada1']).toBeTrue();
    expect(component.shakeFields['saida1']).toBeTrue();
    expect(component.shakeFields['justificativa']).toBeTrue();

    tick(300);

    expect(component.shakeFields['entrada1']).toBeFalse();
    expect(component.shakeFields['saida1']).toBeFalse();
    expect(component.shakeFields['justificativa']).toBeFalse();
  }));

  it('deve retornar "status-pendente" para status "PENDENTE"', () => {
    expect(component.statusClass('PENDENTE')).toBe('status-pendente');
  });

  it('deve retornar "status-aprovado" para status "APROVADO"', () => {
    expect(component.statusClass('APROVADO')).toBe('status-aprovado');
  });

  it('deve retornar "status-rejeitado" para status "REJEITADO"', () => {
    expect(component.statusClass('REJEITADO')).toBe('status-rejeitado');
  });

  it('deve retornar string vazia para status desconhecido', () => {
    expect(component.statusClass('INDEFINIDO')).toBe('');
    expect(component.statusClass('')).toBe('');
    expect(component.statusClass('qualquercoisa')).toBe('');
  });  

});
