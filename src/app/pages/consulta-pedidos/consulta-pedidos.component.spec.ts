import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ConsultaPedidosComponent } from './consulta-pedidos.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PopUpService } from '../../service/notificacao/pop-up.service';
import { PontoService } from '../../service/ponto/ponto.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConsultaPedidosComponent', () => {
  let component: ConsultaPedidosComponent;
  let fixture: ComponentFixture<ConsultaPedidosComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let pontoServiceSpy: jasmine.SpyObj<PontoService>;
  let popUpServiceSpy: jasmine.SpyObj<PopUpService>;

  beforeEach(async () => {
    pontoServiceSpy = jasmine.createSpyObj('PontoService', [
      'consultarPedidos',
    ]);
    popUpServiceSpy = jasmine.createSpyObj('PopUpService', [
      'abrirNotificacao',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ConsultaPedidosComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: routerSpy },
        { provide: PontoService, useValue: pontoServiceSpy },
        { provide: PopUpService, useValue: popUpServiceSpy },
      ],
    })
      .overrideComponent(ConsultaPedidosComponent, {
        set: { template: '<div></div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ConsultaPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

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

  it('deve limpar localStorage e navegar para login ao sair', () => {
    spyOn(localStorage, 'clear');
    component.sair();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve retornar string vazia ao chamar formatarData com data vazia', () => {
    const component = new ConsultaPedidosComponent(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );
    expect(component.formatarData('')).toBe('');
  });

  it('deve formatar data para dd/mm/aa ao chamar formatarData', () => {
    const component = new ConsultaPedidosComponent(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );
    expect(component.formatarData('2025-06-12')).toBe('12/06/2025');
  });

  it('deve abrir o modal de alteração e definir o pedido e overflow hidden no body', () => {
    const rendererSpy = jasmine.createSpyObj('Renderer2', ['setStyle']);
    const elementMock = { nativeElement: { ownerDocument: { body: {} } } };
    const component = new ConsultaPedidosComponent(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      rendererSpy,
      elementMock as any
    );
    component.modalAlteracao = false;
    component.pedido = undefined;

    const pedidoMock = {
      id: 123,
      login: 'usuario',
      idPonto: 456,
      dataRegistro: '01/01/2025',
      tipoPedido: 'ALTERACAO',
      dataPedido: '01/01/2025',
      statusRegistro: 'PENDENTE',
      statusPedido: 'PENDENTE',
      alteracaoPonto: {},
      registroPonto: {},
    };

    component.abrirModalAlteracao(pedidoMock as any);

    expect(component.modalAlteracao).toBeTrue();
    expect(rendererSpy.setStyle).toHaveBeenCalledWith(
      elementMock.nativeElement.ownerDocument.body,
      'overflow',
      'hidden'
    );
  });

  it('deve atualizar o status do pedido ao chamar atualizarPedido', () => {
    const component = new ConsultaPedidosComponent(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );
    component.pedidos = [
      {
        id: 1,
        login: 'user1',
        idPonto: 10,
        dataRegistro: '01/01/2025',
        tipoPedido: 'ALTERACAO',
        dataPedido: '01/01/2025',
        statusRegistro: 'PENDENTE',
        statusPedido: 'PENDENTE',
        alteracaoPonto: {
          entrada1: '',
          saida1: '',
          entrada2: '',
          saida2: '',
          entrada3: '',
          saida3: '',
          justificativa: '',
        },
        registroPonto: {
          id: 1,
          login: '',
          data: '',
          horasTrabalhadas: '',
          entrada1: '',
          saida1: '',
          entrada2: '',
          saida2: '',
          entrada3: '',
          saida3: '',
          status: '',
          temAlteracao: true,
        },
      },
    ];

    component.atualizarPedido({ id: 1, status: 'APROVADO' });

    expect(component.pedidos[0].statusPedido).toBe('APROVADO');
  });

  it('deve popular pedidos e exibir sucesso ao consultar com sucesso', (done) => {
    const pedidosMock = [
      {
        id: 1,
        login: 'user1',
        idPonto: 10,
        dataRegistro: '01/01/2025',
        tipoPedido: 'ALTERACAO',
        dataPedido: '01/01/2025',
        statusRegistro: 'PENDENTE',
        statusPedido: 'PENDENTE',
        alteracaoPonto: {
          entrada1: '',
          saida1: '',
          entrada2: '',
          saida2: '',
          entrada3: '',
          saida3: '',
          justificativa: '',
        },
        registroPonto: {
          id: 1,
          login: '',
          data: '',
          horasTrabalhadas: '',
          entrada1: '',
          saida1: '',
          entrada2: '',
          saida2: '',
          entrada3: '',
          saida3: '',
          status: '',
          temAlteracao: true,
        },
      },
    ];

    pontoServiceSpy.consultarPedidos.and.returnValue(of(pedidosMock));

    component.consultar();

    setTimeout(() => {
      expect(component.pedidos).toEqual(pedidosMock);
      expect(component.sucesso).toBe('Pedidos consultados com sucesso.');
      expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
      expect(component.carregando).toBeFalse();
      done();
    }, 1100);
  });

  it('deve exibir erro de login expirado e chamar sair ao receber erro 401', (done) => {
    pontoServiceSpy.consultarPedidos.and.returnValue(
      throwError(() => ({
        status: 401,
        error: 'Login expirado. Por favor, faça login novamente.',
      }))
    );
    spyOn(component, 'sair');

    component.consultar();

    setTimeout(() => {
      expect(component.error).toBe(
        'Login expirado. Por favor, faça login novamente.'
      );
      expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
      expect(component.sair).toHaveBeenCalled();
      done();
    }, 1100);
  });

  it('deve exibir erro interno ao receber erro 500', (done) => {
    pontoServiceSpy.consultarPedidos.and.returnValue(
      throwError(() => ({
        status: 0,
        error:
          'Desculpe, ocorreu um erro interno ao tentar consultar os pedidos. Tente novamente mais tarde.',
      }))
    );

    component.consultar();

    setTimeout(() => {
      expect(component.error).toBe(
        'Desculpe, ocorreu um erro interno ao tentar consultar os pedidos. Tente novamente mais tarde.'
      );
      expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
      done();
    }, 600);
  });

  it('deve exibir mensagem de nenhum pedido encontrado se erro incluir "Nenhum pedido"', (done) => {
    pontoServiceSpy.consultarPedidos.and.returnValue(
      throwError(() => ({ status: 400, error: 'Nenhum pedido encontrado' }))
    );

    component.consultar();

    setTimeout(() => {
      expect(component.error).toBe(
        'Desculpe, não existem pedidos com essas características.'
      );
      expect(component.carregando).toBeFalse();
      done();
    }, 600);
  });

  it('deve chamar pontoService.consultarPedidos e retornar erro quando lista vazia', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
    component.formulario.get('inicio')?.setValue('2025-06-01');
    component.formulario.get('final')?.setValue('2025-06-10');
    component.formulario.get('tipo')?.setValue('REGISTRO');
    component.formulario.get('status')?.setValue('PENDENTE');

    pontoServiceSpy.consultarPedidos.and.returnValue(of([]));

    component.consultar();

    expect(pontoServiceSpy.consultarPedidos).toHaveBeenCalledWith({
      dtInicio: '01/06/2025',
      dtFinal: '10/06/2025',
      status: 'PENDENTE',
      tipo: 'REGISTRO',
    });

    tick(1000);
    expect(component.pedidos.length).toBe(0);
    expect(component.error).toBe('Nenhum pedido encontrado.');
  }));
});
