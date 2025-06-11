import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../../interface/login';
import { TrocarSenha } from '../../interface/trocar-senha';
import { LoginResponse } from '../../interface/login-response';
import { IGNORAR_INTERCPTOR } from '../../interceptor/token-validation.interceptor';
import { environment } from '../../../environments/environment';
import { RegistroPonto } from '../../interface/registro-ponto';
import { ConsultaRegistros } from '../../interface/consulta-registros';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  login(login: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}login`, login, {
      context: new HttpContext().set(IGNORAR_INTERCPTOR, true),
    });
  }

  sair() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  enviarCodigo(email: { email: string }): Observable<string> {
    return this.http.post<string>(`${this.API_URL}senha/enviar-codigo`, email, { 
      responseType: 'text' as 'json',
      context: new HttpContext().set(IGNORAR_INTERCPTOR, true)
    });
  }

  trocarSenha(trocarSenha: TrocarSenha): Observable<string> {
    return this.http.post<string>(`${this.API_URL}senha/redefinir`, trocarSenha, { 
      responseType: 'text' as 'json',
      context: new HttpContext().set(IGNORAR_INTERCPTOR, true) 
    });
  }

  consultarPonto(consultarResgistros: ConsultaRegistros): Observable<RegistroPonto[]> {
    return this.http.put<RegistroPonto[]>(`${this.API_URL}ponto/consulta`, consultarResgistros, { });
  }
}
