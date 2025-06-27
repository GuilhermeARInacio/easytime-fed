import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';
import { Validators } from '@angular/forms';
import { LoginComponent } from './login.component';
import { UsuarioService } from '../../service/usuario/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<any>;
  let routerSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['login']);
    usuarioServiceSpy.login.and.returnValue(of({}));
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} } 
      ]
    })
    .overrideComponent(LoginComponent, {
      set: { template: '<div></div>' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    component.formulario = component['formBuilder'].group({
      login: ['usuarioValido', [Validators.required]],
      senha: ['senhaValida123', [Validators.required, Validators.minLength(8)]]
    });
  });

  it('deve logar e navegar se o formulário for válido', () => {
    const response = { token: 'token123' };
    usuarioServiceSpy.login.and.returnValue(of(response));
    spyOn(localStorage, 'setItem');

    component.formulario.setValue({
      login: 'usuarioValido',
      senha: 'senhaValida@123'
    });

    component.enviarLogin();

    expect(usuarioServiceSpy.login).toHaveBeenCalledWith(component.formulario.value);
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'token123');
    expect(localStorage.setItem).toHaveBeenCalledWith('login', 'usuarioValido');
    expect(component.error).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/bater-ponto']);
  });

  it('deve mostrar erro de credenciais inválidas se status 401', () => {
    component.formulario.get('login')?.setValue('usuarioValido');
    component.formulario.get('senha')?.setValue('senhaValida123');

    usuarioServiceSpy.login.and.returnValue(throwError(() => ({ status: 401 })));

    component.enviarLogin();

    expect(component.error).toBe('Login ou senha inválidos. Verifique suas credenciais.');
  });

  it('deve mostrar mensagem de erro do backend se houver', () => {
    usuarioServiceSpy.login.and.returnValue(throwError(() => ({ status: 500, error: { message: 'Erro interno do servidor. Tente novamente mais tarde.' } })));

    component.enviarLogin();

    expect(component.error).toBe('Erro interno do servidor. Tente novamente mais tarde.');
  });

  it('deve mostrar mensagem do backend caso o erro seja diferente de 401 ou 500', () => {
    usuarioServiceSpy.login.and.returnValue(throwError(() => ({ status: 400, error: 'Erro ao realizar login. Tente novamente mais tarde.' })));

    component.enviarLogin();

    expect(component.error).toBe('Erro ao realizar login. Tente novamente mais tarde.');
  });

  it('deve mostrar mensagem padrão se err.erro for nulo', () => {
    usuarioServiceSpy.login.and.returnValue(throwError(() => ({ status: 500, error: {} })));

    component.enviarLogin();

    expect(component.error).toBe('Erro interno do servidor. Tente novamente mais tarde.');
  });

  it('deve marcar controles como touched e setar shakeFields se formulário inválido', () => {
    component.formulario.get('login')?.setValue('');
    component.formulario.get('senha')?.setValue('123');
    spyOn(component.formulario, 'markAllAsTouched').and.callThrough();

    jasmine.clock().install();
    component.enviarLogin();

    expect(component.formulario.markAllAsTouched).toHaveBeenCalled();
    expect(component.shakeFields['login']).toBeTrue();
    expect(component.shakeFields['senha']).toBeTrue();

    jasmine.clock().tick(301);
    expect(component.shakeFields['login']).toBeFalse();
    expect(component.shakeFields['senha']).toBeFalse();
    jasmine.clock().uninstall();

    expect(usuarioServiceSpy.login).not.toHaveBeenCalled();
  });

  it('deve alternar o valor de showPassword', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });

  it('deve criar o formulário no ngOnInit e limpar error ao alterar login ou senha', () => {
    component.error = 'Erro qualquer';
    component.ngOnInit();

    expect(component.formulario).toBeTruthy();
    expect(component.formulario.get('login')).toBeTruthy();
    expect(component.formulario.get('senha')).toBeTruthy();

    component.formulario.get('login')?.setValue('novoLogin');
    expect(component.error).toBeNull();

    component.error = 'Outro erro';
    component.formulario.get('senha')?.setValue('novaSenha123');
    expect(component.error).toBeNull();
  });
});