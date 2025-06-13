export interface ConsultaRegistros {
    login: string;
    dtInicio: string;
    dtFinal: string;
    pagina?: number; // Para paginação, se necessário
    tamanhoPagina?: number; // Para paginação, se necessário
}
