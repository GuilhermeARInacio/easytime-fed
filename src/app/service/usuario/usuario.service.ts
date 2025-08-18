import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../../interface/usuario/login';
import { TrocarSenha } from '../../interface/usuario/trocar-senha';
import { LoginResponse } from '../../interface/usuario/login-response';
import { IGNORAR_INTERCPTOR } from '../../interceptor/token-validation.interceptor';
import { environment } from '../../../environments/environment';
import { RegistroPonto } from '../../interface/ponto/registro-ponto';
import { ConsultaRegistros } from '../../interface/ponto/consulta-registros';
import { Router } from '@angular/router';
import { CadastroUsuario } from '../../interface/usuario/cadastro-usuario';

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

  cadastrarUsuario(usuario: CadastroUsuario): Observable<string> {
    return this.http.put<string>(`${this.API_URL}users/create`, usuario, { 
      responseType: 'text' as 'json',
    });
  }
}
