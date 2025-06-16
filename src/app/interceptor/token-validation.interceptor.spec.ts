import { TestBed } from '@angular/core/testing';
import { HttpContext, HttpHeaders, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import { IGNORAR_INTERCPTOR, tokenValidationInterceptor } from './token-validation.interceptor';
import { Router } from '@angular/router';

describe('tokenValidationInterceptor', () => {
  let nextSpy: jasmine.Spy;
  let routerSpy: jasmine.SpyObj<Router>;
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => tokenValidationInterceptor(req, next));

  function criarToken(exp: number) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ exp }));
    return `${header}.${payload}.signature`;
  }

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });
    nextSpy = jasmine.createSpy('next').and.callFake((req) => req);
    spyOn(localStorage, 'removeItem');
    spyOn(console, 'warn');
  });

  it('deve criar componente', () => {
    expect(interceptor).toBeTruthy();
  });

  it('não faz nada se IGNORAR_INTERCPTOR for false', () => {
    const req = new HttpRequest('GET', '/api/teste', {
      headers: new HttpHeaders({ Authorization: 'Bearer token' }),
      context: new HttpContext()
    });

    interceptor(req, nextSpy);

    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(req);
  });

  it('não faz nada se não houver Authorization', () => {
    const context = new HttpContext().set(IGNORAR_INTERCPTOR, true);
    const req = new HttpRequest('GET', '/api/teste', { context });

    interceptor(req, nextSpy);

    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(req);
  });

  it('remove token e redireciona se token expirado', () => {
    const exp = Math.floor(Date.now() / 1000) - 10;
    const token = criarToken(exp);
    const context = new HttpContext().set(IGNORAR_INTERCPTOR, true);
    const req = new HttpRequest('GET', '/api/teste', {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      context
    });

    interceptor(req, nextSpy);

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(console.warn).toHaveBeenCalledWith('Token expirado, redirecionando para login');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(nextSpy).toHaveBeenCalledWith(req);
  });

  it('não remove token se token não expirado', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600; // expira em 1h
    const token = criarToken(exp);
    const context = new HttpContext().set(IGNORAR_INTERCPTOR, true);
    const req = new HttpRequest('GET', '/api/teste', {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      context
    });

    interceptor(req, nextSpy);

    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(req);
  });

  it('remove token se Authorization for inválido', () => {
    const context = new HttpContext().set(IGNORAR_INTERCPTOR, true);
    const req = new HttpRequest('GET', '/api/teste', {
      headers: new HttpHeaders({ Authorization: 'Bearer token-invalido' }),
      context
    });

    interceptor(req, nextSpy);

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(console.warn).toHaveBeenCalledWith('Token expirado, redirecionando para login');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(nextSpy).toHaveBeenCalledWith(req);
  });
});
