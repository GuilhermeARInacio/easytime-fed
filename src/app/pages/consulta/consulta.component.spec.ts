import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ConsultaComponent } from './consulta.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificacaoService } from '../../service/notificacao/notificacao.service';
import { PontoService } from '../../service/ponto/ponto.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConsultaComponent', () => {
  let component: ConsultaComponent;
  let fixture: ComponentFixture<ConsultaComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let pontoServiceSpy: jasmine.SpyObj<PontoService>;
  let notificacaoServiceSpy: jasmine.SpyObj<NotificacaoService>;

  beforeEach(async () => {
    pontoServiceSpy = jasmine.createSpyObj('PontoService', ['consultarPonto']);
    pontoServiceSpy.consultarPonto.and.returnValue(of([{
      id: 1,
      login: 'login',
      data: '08/06/2025',
      horasTrabalhadas: '08:00:00',
      entrada1: '08:00:00',
      saida1: '12:00:00',
      entrada2: '13:00:00',
      saida2: '17:00:00',
      entrada3: '',
      saida3: '',
      status: 'PENDENTE'
    }]))
    notificacaoServiceSpy = jasmine.createSpyObj('NotificacaoService', ['abrirNotificacao']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ConsultaComponent, 
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
    .overrideComponent(ConsultaComponent, {
      set: { template: '<div></div>' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaComponent);
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

  it('deve chamar pontoService.consultarPonto e abrir notificação de sucesso', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
    component.formulario.get('inicio')?.setValue('2025-06-01');
    component.formulario.get('final')?.setValue('2025-06-10');

    const response = [
      {
        id: 1,
        login: 'login',
        data: '08/06/2025',
        horasTrabalhadas: '08:00:00',
        entrada1: '08:00:00',
        saida1: '12:00:00',
        entrada2: '13:00:00',
        saida2: '17:00:00',
        entrada3: '',
        saida3: '',
        status: 'PENDENTE'
      }
    ];
    pontoServiceSpy.consultarPonto.and.returnValue(of(response));

    component.consultar();

    expect(pontoServiceSpy.consultarPonto).toHaveBeenCalledWith({
      login: 'usuarioValido',
      dtInicio: '01/06/2025',
      dtFinal: '10/06/2025'
    });
    
    tick(1000);
    expect(component.error).toBeNull();
    expect(notificacaoServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
      titulo: 'Consulta bem sucedida',
      mensagem: 'Registros consultados com sucesso.',
      tipo: 'sucesso',
      icon: ''
    }));
  }));

  it('deve chamar pontoService.consultarPonto e retornar erro quando lista vazia', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
    component.formulario.get('inicio')?.setValue('2025-06-01');
    component.formulario.get('final')?.setValue('2025-06-10');

    pontoServiceSpy.consultarPonto.and.returnValue(of([]));

    component.consultar();

    expect(pontoServiceSpy.consultarPonto).toHaveBeenCalledWith({
      login: 'usuarioValido',
      dtInicio: '01/06/2025',
      dtFinal: '10/06/2025'
    });
    
    tick(1000);
    expect(component.registros.length).toBe(0);
    expect(component.error).toBe('Nenhum registro encontrado para o período informado.');
  }));

  it('deve tratar erro 401 ao consultar e chamar sair', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
    component.formulario.get('inicio')?.setValue('2025-06-01');
    component.formulario.get('final')?.setValue('2025-06-10');
    spyOn(component, 'sair');
    
    pontoServiceSpy.consultarPonto.and.returnValue(throwError(() => ({ status: 401, error: 'Login expirado. Por favor, faça login novamente.' })));

    component.consultar();
    expect(component.error).toBe('Login expirado. Por favor, faça login novamente.');
    expect(notificacaoServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
      titulo: 'Erro',
      mensagem: 'Login expirado. Por favor, faça login novamente.',
      tipo: 'erro',
      icon: ''
    }));

    tick(1000);
    expect(component.sair).toHaveBeenCalled();
  }));

  it('deve tratar erro 400 ao consultar', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
    component.formulario.get('inicio')?.setValue('2025-06-01');
    component.formulario.get('final')?.setValue('2025-06-10');
    
    pontoServiceSpy.consultarPonto.and.returnValue(throwError(() => ({ status: 400, error: 'Nenhum registro encontrado para o período informado.' })));

    component.consultar();
    expect(component.error).toBe('Nenhum registro encontrado para o período informado.');
  }));

  it('deve marcar controles como touched e setar shakeFields se formulário inválido', () => {
    component.formulario.get('inicio')?.setValue('');
    component.formulario.get('final')?.setValue('');
    spyOn(component.formulario, 'markAllAsTouched').and.callThrough();

    jasmine.clock().install();
    component.consultar();

    expect(component.formulario.markAllAsTouched).toHaveBeenCalled();
    expect(component.shakeFields['inicio']).toBeTrue();
    expect(component.shakeFields['final']).toBeTrue();

    jasmine.clock().tick(301);
    expect(component.shakeFields['inicio']).toBeFalse();
    expect(component.shakeFields['final']).toBeFalse();
    jasmine.clock().uninstall();

    expect(pontoServiceSpy.consultarPonto).not.toHaveBeenCalled();
  });

  it('deve retornar string vazia ao chamar formatarData com data vazia', () => {
    const component = new ConsultaComponent(
      {} as any, {} as any, {} as any, {} as any
    );
    expect(component.formatarData('')).toBe('');
  });

  it('deve retornar string vazia ao chamar formatarDataRetorno com data vazia', () => {
    const component = new ConsultaComponent(
      {} as any, {} as any, {} as any, {} as any
    );
    expect(component.formatarDataRetorno('')).toBe('');
  });

  it('deve formatar data para dd/mm/aa ao chamar formatarDataRetorno', () => {
    const component = new ConsultaComponent(
      {} as any, {} as any, {} as any, {} as any
    );
    expect(component.formatarDataRetorno('12/06/2025')).toBe('12/06/25');
  });

  it('deve limpar localStorage e navegar para login ao sair', () => {
    spyOn(localStorage, 'clear');
    component.sair();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
