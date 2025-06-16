import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar usuário fazer login (POST)', () => {
    const login = { login: 'usuario', senha: 'senha123' };
    const responseMock = { token: 'token123' };

    service.login(login).subscribe(response => {
      expect(response).toEqual(responseMock);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(login);
    req.flush(responseMock);
  });

  it('deve enviar código (POST)', () => {
    const email = { email: 'email@gmail.com' };
    const responseMock = "código enviado com sucesso";

    service.enviarCodigo(email).subscribe(response => {
      expect(response).toEqual(responseMock);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}senha/enviar-codigo`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(email);
    req.flush(responseMock);
  });

  it('deve trocar senha (POST)', () => {
    const trocarSenha = { 
      code: '12345678', 
      email: 'email@gmail.com',
      senha: 'novaSenha@123' 
    };
    const responseMock = "senha trocada com sucesso";

    service.trocarSenha(trocarSenha).subscribe(response => {
      expect(response).toEqual(responseMock);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}senha/redefinir`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(trocarSenha);
    req.flush(responseMock);
  });
});
