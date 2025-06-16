import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BaterPontoComponent } from './bater-ponto.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificacaoService } from '../../service/notificacao/notificacao.service';
import { PontoService } from '../../service/ponto/ponto.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('BaterPontoComponent', () => {
  let component: BaterPontoComponent;
  let fixture: ComponentFixture<BaterPontoComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let pontoServiceSpy: jasmine.SpyObj<PontoService>;
  let notificacaoServiceSpy: jasmine.SpyObj<NotificacaoService>;

  beforeEach(async () => {
    pontoServiceSpy = jasmine.createSpyObj('PontoService', ['baterPonto']);
    pontoServiceSpy.baterPonto.and.returnValue(of({
      login: 'usuarioTeste',
      data: '2024-06-01',
      horarioBatida: '08:00',
      status: 'PENDENTE'
    }));
    notificacaoServiceSpy = jasmine.createSpyObj('NotificacaoService', ['abrirNotificacao']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        BaterPontoComponent, 
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: routerSpy },
        { provide: PontoService, useValue: pontoServiceSpy },
        { provide: NotificacaoService, useValue: notificacaoServiceSpy }
      ]
    })
    .overrideComponent(BaterPontoComponent, {
      set: { template: '<div></div>' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaterPontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve navegar para /login se não houver token no ngOnInit', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve atualizar o horário atual ao chamar atualizarHorario', () => {
    component.atualizarHorario();
    expect(component.horarioAtual).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('deve chamar pontoService.baterPonto e abrir notificação de sucesso', () => {
    spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
    const response = {
      login: 'usuarioValido',
      data: '2024-06-01',
      horarioBatida: '12:00:00',
      status: 'PENDENTE'
    };
    pontoServiceSpy.baterPonto.and.returnValue(of(response));

    component.baterPonto();

    expect(pontoServiceSpy.baterPonto).toHaveBeenCalledWith({ 
      horarioAtual: new Date()
      .toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) 
    });
    
    expect(component.error).toBeNull();
    expect(notificacaoServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
      titulo: 'Registro de Ponto',
      mensagem: jasmine.stringMatching('Ponto registrado com sucesso às'),
      tipo: 'sucesso'
    }));
  });

  it('deve tratar erro 401 ao bater ponto e chamar sair', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
    spyOn(component, 'sair');
    pontoServiceSpy.baterPonto.and.returnValue(throwError(() => ({ status: 401 })));

    component.baterPonto();
    expect(component.error).toBe('Login expirado. Por favor, faça login novamente.');
    expect(notificacaoServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
      titulo: 'Erro',
      tipo: 'erro'
    }));

    tick(1000);
    expect(component.sair).toHaveBeenCalled();
  }));

  it('deve tratar outros erros ao bater ponto', () => {
    spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
    pontoServiceSpy.baterPonto.and.returnValue(throwError(() => ({ status: 500, error: 'Erro inesperado' })));

    component.baterPonto();

    expect(component.error).toBe('Erro inesperado');
    expect(notificacaoServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
      titulo: 'Erro',
      mensagem: 'Erro inesperado',
      tipo: 'erro'
    }));
  });

  it('deve limpar localStorage e navegar para login ao sair', () => {
    spyOn(localStorage, 'clear');
    component.sair();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve chamar atualizarHorario a cada 1 segundo pelo setInterval do ngOnInit', fakeAsync(() => {
    spyOn(component, 'atualizarHorario');
    spyOn(localStorage, 'getItem').and.returnValue('tokenValido');
    component.ngOnInit();

    expect(component.atualizarHorario).toHaveBeenCalledTimes(1); // chamada inicial

    tick(1000);
    expect(component.atualizarHorario).toHaveBeenCalledTimes(2);

    tick(2000);
    expect(component.atualizarHorario).toHaveBeenCalledTimes(4);
  }));

  it('deve exibir mensagem padrão se err.error estiver vazio ao bater ponto', () => {
    pontoServiceSpy.baterPonto.and.returnValue(throwError(() => ({ status: 500, error: undefined })));

    component.baterPonto();

    expect(component.error).toBe('Erro ao bater ponto. Tente novamente mais tarde.');
    expect(notificacaoServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
      titulo: 'Erro',
      mensagem: 'Erro ao bater ponto. Tente novamente mais tarde.',
      tipo: 'erro'
    }));
  });
});
