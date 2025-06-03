import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export const IGNORAR_INTERCPTOR = new HttpContextToken(() => false);

export const tokenValidationInterceptor: HttpInterceptorFn = (req, next) => {
  if(req.context.get(IGNORAR_INTERCPTOR)) {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('token');
      console.warn('Token expirado, redirecionando para login');
      window.location.href = '/login';
    }
  }
  return next(req);
};
