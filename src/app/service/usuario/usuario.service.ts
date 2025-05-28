import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../../interface/login';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API_URL = 'http://localhost:8081/';

  constructor(private http: HttpClient) { }

  login(login: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}login`, login);
  }

  enviarCodigo(email: { email: string }): Observable<string> {
    // const token = this.getToken();
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    return this.http.post<string>(`${this.API_URL}senha/enviar-codigo`, email, { responseType: 'text' as 'json' });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export interface LoginResponse {
  token: string;
}
