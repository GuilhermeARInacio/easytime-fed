// Verifica se o token de autenticação está presente e, se estiver, adiciona no cabeçalho Authorization
export const autenticacaoInterceptor = (req, next) => {
    const token = localStorage.getItem('token');
    if (token) {
        const clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(clonedReq);
    }
    return next(req);
};
