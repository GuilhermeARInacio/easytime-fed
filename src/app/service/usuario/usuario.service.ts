import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../../interface/login';
import { TrocarSenha } from '../../interface/trocar-senha';
import { LoginResponse } from '../../interface/login-response';
import { IGNORAR_INTERCPTOR } from '../../interceptor/token-validation.interceptor';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(login: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}login`, login, {
      context: new HttpContext().set(IGNORAR_INTERCPTOR, true),
    });
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
}
