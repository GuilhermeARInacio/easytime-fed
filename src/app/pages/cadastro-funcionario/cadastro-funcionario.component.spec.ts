import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CadastroFuncionarioComponent } from './cadastro-funcionario.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../service/usuario/usuario.service';
import { PopUpService } from '../../service/notificacao/pop-up.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('CadastroFuncionarioComponent', () => {
  let component: CadastroFuncionarioComponent;
  let fixture: ComponentFixture<CadastroFuncionarioComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let popUpServiceSpy: jasmine.SpyObj<PopUpService>;

  beforeEach(async () => {
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', [
      'cadastrarUsuario',
    ]);
    popUpServiceSpy = jasmine.createSpyObj('PopUpService', [
      'abrirNotificacao',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CadastroFuncionarioComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: routerSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: PopUpService, useValue: popUpServiceSpy },
      ],
    })
    .overrideComponent(CadastroFuncionarioComponent, {
      set: { template: '<div></div>' },
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário inválido', () => {
    expect(component.formulario.valid).toBeFalse();
  });

  it('deve validar o formulário como válido com dados corretos', () => {
    component.formulario.setValue({
      nome: 'João da Silva',
      email: 'joao@email.com',
      login: 'joaosilva',
      setor: 'TI',
      cargo: 'Desenvolvedor',
      senha: 'Senha@123',
      repetirSenha: 'Senha@123'
    });
    expect(component.formulario.valid).toBeTrue();
  });

  it('deve cadastrar usuário com sucesso', fakeAsync(() => {
    component.formulario.setValue({
      nome: 'João da Silva',
      email: 'joao@email.com',
      login: 'joaosilva',
      setor: 'TI',
      cargo: 'Desenvolvedor',
      senha: 'Senha@123',
      repetirSenha: 'Senha@123'
    });
    usuarioServiceSpy.cadastrarUsuario.and.returnValue(of("Usuário cadastrado com sucesso!"));
    component.cadastrar();
    tick();
    expect(component.sucesso).toBe('Usuário cadastrado com sucesso!');
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
    expect(component.formulario.get('nome')?.value).toBeNull();
  }));

  it('deve tratar erro 401 ao cadastrar', fakeAsync(() => {
    component.formulario.setValue({
      nome: 'João da Silva',
      email: 'joao@email.com',
      login: 'joaosilva',
      setor: 'TI',
      cargo: 'Desenvolvedor',
      senha: 'Senha@123',
      repetirSenha: 'Senha@123'
    });
    usuarioServiceSpy.cadastrarUsuario.and.returnValue(throwError(() => ({ status: 401 })));
    spyOn(component, 'sair');
    component.cadastrar();
    tick(1000);
    expect(component.error).toBe('Login expirado. Por favor, faça login novamente.');
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
    expect(component.sair).toHaveBeenCalled();
  }));

  it('deve tratar erro 500 ao cadastrar', fakeAsync(() => {
    component.formulario.setValue({
      nome: 'João da Silva',
      email: 'joao@email.com',
      login: 'joaosilva',
      setor: 'TI',
      cargo: 'Desenvolvedor',
      senha: 'Senha@123',
      repetirSenha: 'Senha@123'
    });
    usuarioServiceSpy.cadastrarUsuario.and.returnValue(throwError(() => ({ status: 0 })));
    component.cadastrar();
    tick();
    expect(component.error).toBe('Desculpe, ocorreu um erro interno. Tente novamente mais tarde.');
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalled();
  }));

  it('deve limpar localStorage e navegar para login ao sair', () => {
    spyOn(localStorage, 'clear');
    component.sair();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve alternar visibilidade da senha', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
  });

  it('deve tratar erro desconhecido ao cadastrar', fakeAsync(() => {
    component.formulario.setValue({
      nome: 'João da Silva',
      email: 'joao@email.com',
      login: 'joaosilva',
      setor: 'TI',
      cargo: 'Desenvolvedor',
      senha: 'Senha@123',
      repetirSenha: 'Senha@123'
    });
    usuarioServiceSpy.cadastrarUsuario.and.returnValue(throwError(() => ({ status: 400, error: 'Email já em uso.' })));
    component.cadastrar();
    tick();
    expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
      mensagem: 'Email já em uso.'
    }));
  }));
});
