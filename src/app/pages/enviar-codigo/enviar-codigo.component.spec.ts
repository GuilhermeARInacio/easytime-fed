import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarCodigoComponent } from './enviar-codigo.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { UsuarioService } from '../../service/usuario/usuario.service';

describe('EnviarCodigoComponent', () => {
  let component: EnviarCodigoComponent;
  let fixture: ComponentFixture<EnviarCodigoComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<any>;
  let routerSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['enviarCodigo']);
    usuarioServiceSpy.enviarCodigo.and.returnValue(of({}));
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        EnviarCodigoComponent, 
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: routerSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy }
      ]
    })
    .overrideComponent(EnviarCodigoComponent, {
      set: { template: '<div></div>' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviarCodigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (window as any).component = component;
    (window as any).fixture = fixture;
  });

  function getComponent() {
    return (window as any).component as EnviarCodigoComponent;
  }

  it('deve enviar codigo com sucesso', () => {
    const component = getComponent();
    const emailValue = 'test@example.com';
    component.formulario.setValue({ email: emailValue });
    usuarioServiceSpy.enviarCodigo.and.returnValue(of('success-response'));

    component.enviarEmail();

    expect(component.carregando).toBeFalse();
    expect(component.error).toBeNull();
    expect(component.sucesso).toBe('success-response');
    expect(usuarioServiceSpy.enviarCodigo).toHaveBeenCalledWith({ email: emailValue });
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/trocar-senha'],
      { state: { response: 'success-response', email: emailValue } }
    );
  });

  it('deve retornar erro 401', () => {
    const component = getComponent();
    component.formulario.setValue({ email: 'test@example.com' });
    usuarioServiceSpy.enviarCodigo.and.returnValue(
      throwError(() => ({ status: 401, error: { message: 'Unauthorized' } }))
    );

    component.enviarEmail();

    expect(component.carregando).toBeFalse();
    expect(component.error).toBe('Login ou senha inválidos. Verifique suas credenciais.');
  });

  it('deve dar erro para outros tipos de erro', () => {
    const component = getComponent();
    component.formulario.setValue({ email: 'test@example.com' });
    usuarioServiceSpy.enviarCodigo.and.returnValue(
      throwError(() => ({ status: 500, error: { message: 'Server error' } }))
    );

    component.enviarEmail();

    expect(component.carregando).toBeFalse();
    expect(component.error).toBe('Server error');
  });

  it('deve definir mensagem de erro padrão se err.error.message estiver ausente', () => {
    const component = getComponent();
    component.formulario.setValue({ email: 'test@example.com' });
    usuarioServiceSpy.enviarCodigo.and.returnValue(
      throwError(() => ({ status: 400, error: {} }))
    );

    component.enviarEmail();

    expect(component.carregando).toBeFalse();
    expect(component.error).toBe('Erro ao enviar email. Verifique se o email está correto.');
  });

  it('deve definir mensagem de erro padrão se err.error estiver ausente', () => {
    const component = getComponent();
    component.formulario.setValue({ email: 'test@example.com' });
    usuarioServiceSpy.enviarCodigo.and.returnValue(
      throwError(() => ({ status: 500 }))
    );

    component.enviarEmail();

    expect(component.carregando).toBeFalse();
    expect(component.error).toBe('Erro ao enviar email. Verifique se o email está correto.');
  });

  it('deve limpar o erro ao alterar o valor do email', () => {
    const component = getComponent();
    component.error = 'Algum erro';
    component.formulario.controls['email'].setValue('novo@email.com');
    expect(component.error).toBeNull();
  });

  it('deve marcar todos acionar animação caso formulário inválido', (done) => {
    const component = getComponent();
    spyOn(component.formulario, 'markAllAsTouched');
    component.formulario.controls['email'].setValue(''); // invalid

    component.enviarEmail();

    expect(component.formulario.markAllAsTouched).toHaveBeenCalled();
    expect(component.shakeFields['email']).toBeTrue();

    setTimeout(() => {
      expect(component.shakeFields['email']).toBeFalse();
      done();
    }, 350);
  });
});
