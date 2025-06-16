import { TestBed } from '@angular/core/testing';

import { PontoService } from './ponto.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('PontoService', () => {
  let service: PontoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PontoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve bater ponto (POST)', () => {
    const ponto = { horarioAtual: '08:00' };
    const respostaMock = { login: 'usuario', data: '2024-06-01', horarioBatida: '08:00', status: 'PENDENTE' };

    service.baterPonto(ponto as any).subscribe(res => {
      expect(res).toEqual(respostaMock);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}ponto`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(ponto);
    req.flush(respostaMock);
  });

  it('deve consultar ponto (PUT)', () => {
    const consulta = { inicio: '01/06/2024', final: '10/06/2024' };
    const respostaMock = [
      { 
        id: 1,
        login: 'usuario',
        data: '01/06/2024',
        horasTrabalhadas: '08:00',
        entrada1: '08:00',
        saida1: '12:00',
        entrada2: '13:00',
        saida2: '17:00',
        entrada3: '',
        saida3: '',
        status: 'PENDENTE'
      }
    ];
    
    service.consultarPonto(consulta as any).subscribe(res => expect(res)
      .toEqual(respostaMock));

    const req = httpMock.expectOne(`${environment.apiUrl}ponto/consulta`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(consulta);
    req.flush(respostaMock);
  });
});
