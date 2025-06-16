import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import { autenticacaoInterceptor } from './autenticacao.interceptor';

describe('autenticacaoInterceptor', () => {
  let nextSpy: jasmine.Spy;
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => autenticacaoInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    nextSpy = jasmine.createSpy('next');
    spyOn(localStorage, 'getItem');
  });

  it('deve criar componente', () => {
    expect(interceptor).toBeTruthy();
  });

  it('deve adicionar o header Authorization quando houver token', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('token');
    const req = new HttpRequest('GET', '/api/teste');
    nextSpy.and.callFake((clonedReq: HttpRequest<any>) => clonedReq);

    const result = autenticacaoInterceptor(req, nextSpy);

    expect(nextSpy).toHaveBeenCalled();
    const calledReq = nextSpy.calls.mostRecent().args[0];
    expect(calledReq.headers.get('Authorization')).toBe('Bearer token');
  });

  it('não deve adicionar o header Authorization quando não houver token', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);
    const req = new HttpRequest('GET', '/api/teste');
    nextSpy.and.callFake((r: HttpRequest<any>) => r);

    const result = autenticacaoInterceptor(req, nextSpy);

    expect(nextSpy).toHaveBeenCalledWith(req);
    expect(req.headers.has('Authorization')).toBeFalse();
  });
});
