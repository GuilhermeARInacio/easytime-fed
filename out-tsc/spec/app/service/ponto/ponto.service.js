import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
let PontoService = class PontoService {
    http;
    API_URL = environment.apiUrl;
    constructor(http) {
        this.http = http;
    }
    baterPonto(ponto) {
        return this.http.post(`${this.API_URL}ponto`, ponto, {});
    }
    consultarPonto(consultarResgistros) {
        return this.http.put(`${this.API_URL}ponto/consulta`, consultarResgistros, {});
    }
    alterarRegistro(registro) {
        return this.http.put(`${this.API_URL}ponto/alterar`, registro, { responseType: 'text' });
    }
    consultarAlteracao(idPonto) {
        return this.http.get(`${this.API_URL}ponto/pedido/${idPonto}`);
    }
    consultarPedidos(filtro) {
        return this.http.put(`${this.API_URL}ponto/pedidos/filtrar`, filtro);
    }
    recusarPedido(id) {
        return this.http.post(`${this.API_URL}ponto/reprovar/${id}`, {}, { responseType: 'text' });
    }
    aceitarPedido(id) {
        return this.http.post(`${this.API_URL}ponto/aprovar/${id}`, {}, { responseType: 'text' });
    }
};
PontoService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], PontoService);
export { PontoService };
