import { HttpClient } from '@angular/common/http';
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

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export interface LoginResponse {
  token: string;
}
