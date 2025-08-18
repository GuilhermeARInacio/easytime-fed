import { CapitalizePipe } from './capitalize.pipe';
describe('CapitalizePipe', () => {
    let pipe;
    beforeEach(() => {
        pipe = new CapitalizePipe();
    });
    it('deve ser criado', () => {
        expect(pipe).toBeTruthy();
    });
    it('deve capitalizar apenas a primeira letra', () => {
        expect(pipe.transform('aprovado')).toBe('Aprovado');
        expect(pipe.transform('PENDENTE')).toBe('Pendente');
        expect(pipe.transform('rEjEitado')).toBe('Rejeitado');
    });
    it('deve retornar string vazia se valor for falsy', () => {
        expect(pipe.transform('')).toBe('');
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });
});
