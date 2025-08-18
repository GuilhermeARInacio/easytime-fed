import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { autenticacaoInterceptor } from './autenticacao.interceptor';
describe('autenticacaoInterceptor', () => {
    let nextSpy;
    const interceptor = (req, next) => TestBed.runInInjectionContext(() => autenticacaoInterceptor(req, next));
    beforeEach(() => {
        TestBed.configureTestingModule({});
        nextSpy = jasmine.createSpy('next');
        spyOn(localStorage, 'getItem');
    });
    it('deve criar componente', () => {
        expect(interceptor).toBeTruthy();
    });
    it('deve adicionar o header Authorization quando houver token', () => {
        localStorage.getItem.and.returnValue('token');
        const req = new HttpRequest('GET', '/api/teste');
        nextSpy.and.callFake((clonedReq) => clonedReq);
        const result = autenticacaoInterceptor(req, nextSpy);
        expect(nextSpy).toHaveBeenCalled();
        const calledReq = nextSpy.calls.mostRecent().args[0];
        expect(calledReq.headers.get('Authorization')).toBe('Bearer token');
    });
    it('não deve adicionar o header Authorization quando não houver token', () => {
        localStorage.getItem.and.returnValue(null);
        const req = new HttpRequest('GET', '/api/teste');
        nextSpy.and.callFake((r) => r);
        const result = autenticacaoInterceptor(req, nextSpy);
        expect(nextSpy).toHaveBeenCalledWith(req);
        expect(req.headers.has('Authorization')).toBeFalse();
    });
});
