import { __decorate } from "tslib";
import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGNORAR_INTERCPTOR } from '../../interceptor/token-validation.interceptor';
import { environment } from '../../../environments/environment';
let UsuarioService = class UsuarioService {
    http;
    router;
    API_URL = environment.apiUrl;
    constructor(http, router) {
        this.http = http;
        this.router = router;
    }
    login(login) {
        return this.http.post(`${this.API_URL}login`, login, {
            context: new HttpContext().set(IGNORAR_INTERCPTOR, true),
        });
    }
    enviarCodigo(email) {
        return this.http.post(`${this.API_URL}senha/enviar-codigo`, email, {
            responseType: 'text',
            context: new HttpContext().set(IGNORAR_INTERCPTOR, true)
        });
    }
    trocarSenha(trocarSenha) {
        return this.http.post(`${this.API_URL}senha/redefinir`, trocarSenha, {
            responseType: 'text',
            context: new HttpContext().set(IGNORAR_INTERCPTOR, true)
        });
    }
    cadastrarUsuario(usuario) {
        return this.http.put(`${this.API_URL}users/create`, usuario, {
            responseType: 'text',
        });
    }
};
UsuarioService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], UsuarioService);
export { UsuarioService };
