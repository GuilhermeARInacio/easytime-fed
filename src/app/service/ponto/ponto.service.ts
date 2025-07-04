import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaterPonto } from '../../interface/ponto/bater-ponto';
import { Observable } from 'rxjs';
import { BaterPontoResponse } from '../../interface/ponto/bater-ponto-response';
import { environment } from '../../../environments/environment';
import { ConsultaRegistros } from '../../interface/ponto/consulta-registros';
import { RegistroPonto } from '../../interface/ponto/registro-ponto';
import { AlterarPonto } from '../../interface/ponto/alterar-ponto';
import { FiltroPedidos } from '../../interface/ponto/filtro-pedidos';
import { PedidoPonto } from '../../interface/ponto/pedido-ponto';

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

  alterarRegistro(registro: AlterarPonto): Observable<string> {
    return this.http.put<string>(`${this.API_URL}ponto/alterar`, registro, { responseType: 'text' as 'json' });
  }

  consultarAlteracao(idPonto: number): Observable<AlterarPonto> {
    return this.http.get<AlterarPonto>(`${this.API_URL}ponto/pedido/${idPonto}`);
  }

  consultarPedidos(filtro: FiltroPedidos): Observable<PedidoPonto[]> {
    return this.http.put<PedidoPonto[]>(`${this.API_URL}ponto/pedidos/filtrar`, filtro );
  }

  recusarPedido(id: number): Observable<string> {
    return this.http.post<string>(`${this.API_URL}ponto/reprovar/${id}`, {}, { responseType: 'text' as 'json' });
  }

  aceitarPedido(id: number): Observable<string> {
    return this.http.post<string>(`${this.API_URL}ponto/aprovar/${id}`, {}, { responseType: 'text' as 'json' });
  }
}
