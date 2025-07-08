import { AlterarPonto } from "./alterar-ponto"
import { PontoAlteracao } from "./ponto-alteracao"
import { RegistroPonto } from "./registro-ponto"

export interface PedidoPonto {
    id: number,
    login: string,
    idPonto: number,
    dataRegistro: string,
    tipoPedido: string,
    dataPedido: string,
    statusRegistro: string,
    statusPedido: string,
    alteracaoPonto: PontoAlteracao | null,
    registroPonto: RegistroPonto | null
}
