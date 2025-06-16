import { TrocarSenha } from '../../interface/trocar-senha';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TrocarSenhaComponent } from './trocar-senha.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { UsuarioService } from '../../service/usuario/usuario.service';

describe('TrocarSenhaComponent', () => {
  let component: TrocarSenhaComponent;
  let fixture: ComponentFixture<TrocarSenhaComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<any>;
  let routerSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['trocarSenha']);
    usuarioServiceSpy.trocarSenha.and.returnValue(of({}));
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.getCurrentNavigation = jasmine.createSpy('getCurrentNavigation');
    routerSpy.getCurrentNavigation.and.returnValue({
      extras: {
        state: {
          response: 'Codigo enviado com sucesso',
          email: 'email@gmail.com'
        }
      }
    } as any)

    await TestBed.configureTestingModule({
      imports: [
        TrocarSenhaComponent, 
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: routerSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy }
      ]
    })
    .overrideComponent(TrocarSenhaComponent, {
      set: { template: '<div></div>' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrocarSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getComponent() {
    return (window as any).component as TrocarSenhaComponent;
  }

  it('deve trocar a senha e navegar para /login se o formulário for válido', fakeAsync(() => {
    const trocarSenha: TrocarSenha = {
      code: '12345678',
      email: 'email@gmail.com',
      senha: 'novaSenha@123'
    };

    component.formulario.setValue({
      codigo: trocarSenha.code,
      novaSenha: trocarSenha.senha,
      repetirSenha: trocarSenha.senha
    });
    usuarioServiceSpy.trocarSenha.and.returnValue(of('Senha alterada com sucesso'));
    component.enviarTrocaSenha();

    expect(usuarioServiceSpy.trocarSenha).toHaveBeenCalledWith(trocarSenha);
    expect(component.error).toBeNull();
    tick(1000);
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/login'],
      { state: { response: 'Senha alterada com sucesso' } }
    );
  }))

  it('deve dar erro 401 quando o código estiver invalido', () => {
    const trocarSenha: TrocarSenha = {
      code: '12345678',
      email: 'email@gmail.com',
      senha: 'novaSenha@123'
    };
    component.formulario.setValue({
      codigo: trocarSenha.code,
      novaSenha: trocarSenha.senha,
      repetirSenha: trocarSenha.senha
    });

    usuarioServiceSpy.trocarSenha.and.returnValue(
      throwError(() => ({ status: 401, error: { message: 'Código inválido. Solicite um novo código de recuperação.' } }))
    );
    component.enviarTrocaSenha();

    expect(usuarioServiceSpy.trocarSenha).toHaveBeenCalledWith(trocarSenha);
    expect(component.error).toBe('Código inválido. Solicite um novo código de recuperação.');
  })

  it('deve dar erro genérico quando ocorrer outro tipo de erro', () => {
    const trocarSenha: TrocarSenha = {
      code: '12345678',
      email: 'email@gmail.com',
      senha: 'novaSenha@123'
    };
    component.formulario.setValue({
      codigo: trocarSenha.code,
      novaSenha: trocarSenha.senha,
      repetirSenha: trocarSenha.senha
    });

    usuarioServiceSpy.trocarSenha.and.returnValue(
      throwError(() => ({ status: 500, error: 'Server error' }))
    );
    component.enviarTrocaSenha();

    expect(usuarioServiceSpy.trocarSenha).toHaveBeenCalledWith(trocarSenha);
    expect(component.error).toBe('Server error');
  });

  it('deve marcar todos acionar animação caso formulário inválido', (done) => {
    spyOn(component.formulario, 'markAllAsTouched');
    component.formulario.setValue({
      codigo: '',
      novaSenha: '',
      repetirSenha: ''
    });

    component.enviarTrocaSenha();

    expect(component.formulario.markAllAsTouched).toHaveBeenCalled();
    expect(component.shakeFields['codigo']).toBeTrue();
    expect(component.shakeFields['novaSenha']).toBeTrue();
    expect(component.shakeFields['repetirSenha']).toBeTrue();

    setTimeout(() => {
      expect(component.shakeFields['codigo']).toBeFalse();
      expect(component.shakeFields['novaSenha']).toBeFalse();
      expect(component.shakeFields['repetirSenha']).toBeFalse();
      done();
    }, 350);
  });

  it('deve alternar o valor de showPassword', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });

  it('deve exibir mensagem padrão se err.error estiver vazio ao trocar senha', () => {
    const trocarSenha = {
      code: '12345678',
      email: 'email@gmail.com',
      senha: 'novaSenha@123'
    };
    component.formulario.setValue({
      codigo: trocarSenha.code,
      novaSenha: trocarSenha.senha,
      repetirSenha: trocarSenha.senha
    });

    usuarioServiceSpy.trocarSenha.and.returnValue(
      throwError(() => ({ status: 500, error: undefined }))
    );

    spyOn(component, 'abrirNotificacao');

    component.enviarTrocaSenha();

    expect(component.error).toBe('Código inválido. Solicite um novo código de recuperação.');
  });
});
