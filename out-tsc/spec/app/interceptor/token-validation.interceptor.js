import { HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    }
    catch {
        return true;
    }
}
export const IGNORAR_INTERCPTOR = new HttpContextToken(() => false);
export const tokenValidationInterceptor = (req, next) => {
    const router = inject(Router);
    if (req.context.get(IGNORAR_INTERCPTOR)) {
        const token = req.headers.get('Authorization')?.replace('Bearer ', '');
        if (token && isTokenExpired(token)) {
            localStorage.removeItem('token');
            console.warn('Token expirado, redirecionando para login');
            router.navigate(['/login']);
        }
    }
    return next(req);
};
