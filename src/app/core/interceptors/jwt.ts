import { HttpInterceptorFn } from '@angular/common/http';

export const Jwt: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('access_token');

  if (token && req.url.includes('/api/v1/')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }
  return next(req);
};
