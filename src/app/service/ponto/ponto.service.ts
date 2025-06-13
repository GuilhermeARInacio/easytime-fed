import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaterPonto } from '../../interface/bater-ponto';
import { Observable } from 'rxjs';
import { BaterPontoResponse } from '../../interface/bater-ponto-response';
import { environment } from '../../../environments/environment';
import { ConsultaRegistros } from '../../interface/consulta-registros';
import { RegistroPonto } from '../../interface/registro-ponto';

@Injectable({
  providedIn: 'root'
})
export class PontoService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  baterPonto(ponto: BaterPonto): Observable<BaterPontoResponse> {
    return this.http.post<BaterPontoResponse>(`${this.API_URL}ponto`, ponto, { });
  }

  consultarPonto(consultarResgistros: ConsultaRegistros): Observable<RegistroPonto[]> {
    return this.http.put<RegistroPonto[]>(`${this.API_URL}ponto/consulta`, consultarResgistros, { });
  }
}
