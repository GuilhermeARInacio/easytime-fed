import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacaoComponent } from './notificacao.component';
import { NotificacaoService } from '../../service/notificacao/notificacao.service';
import { Subject } from 'rxjs';

describe('NotificacaoComponent', () => {
  let component: NotificacaoComponent;
  let fixture: ComponentFixture<NotificacaoComponent>;
  let notificacaoServiceSpy: jasmine.SpyObj<NotificacaoService>;
  let notificacaoSubject: Subject<any>;

  beforeEach(async () => {
    notificacaoSubject = new Subject();
    notificacaoServiceSpy = jasmine.createSpyObj(
      'NotificacaoService',
      ['abrirNotificacao'],
      {
        notificacao$: notificacaoSubject.asObservable(),
      }
    );

    await TestBed.configureTestingModule({
      imports: [NotificacaoComponent],
      providers: [
        { provide: NotificacaoService, useValue: notificacaoServiceSpy },
      ],
    })
      .overrideComponent(NotificacaoComponent, {
        set: { template: '<div></div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NotificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve abrir notificação de tipo enviado', () => {
    const notificacao = {
      titulo: 'Teste Enviado',
      mensagem: 'Teste enviado',
      tipo: 'enviado',
      icon: '',
    };
    component.abrirNotificacao(notificacao);
    expect(component.visivel).toBeTrue();
    expect(component.notificacao).toEqual({ ...notificacao, icon: 'send' });
  });

  it('deve abrir notificação de tipo erro', () => {
    const notificacao = {
      titulo: 'Erro',
      mensagem: 'Ocorreu um erro',
      tipo: 'erro',
      icon: '',
    };
    component.abrirNotificacao(notificacao);
    expect(component.visivel).toBeTrue();
    expect(component.notificacao).toEqual({ ...notificacao, icon: 'warning' });
  });

  it('deve abrir notificação de tipo sucesso', () => {
    const notificacao = {
      titulo: 'Sucesso',
      mensagem: 'Operação realizada',
      tipo: 'sucesso',
      icon: '',
    };
    component.abrirNotificacao(notificacao);
    expect(component.visivel).toBeTrue();
    expect(component.notificacao).toEqual({ ...notificacao, icon: 'check' });
  });

  it('deve esconder notificação após 5 segundos', (done) => {
    const notificacao = {
      titulo: 'Teste',
      mensagem: 'Mensagem',
      tipo: 'enviado',
      icon: '',
    };
    jasmine.clock().install();
    component.abrirNotificacao(notificacao);
    expect(component.visivel).toBeTrue();
    jasmine.clock().tick(5001);
    expect(component.visivel).toBeFalse();
    jasmine.clock().uninstall();
    done();
  });
});
