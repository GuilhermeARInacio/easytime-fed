import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API_URL = 'http://localhost:8080/';

  //constructor(private http: HttpClient) { }

  //login(login: string, senha: string){
  //  return this.http.post(`${this.API_URL}login`, { login, senha });
  //}
}
