import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const hasSignalToken = !!authService.currentUserToken();
  const hasStorageToken = !!sessionStorage.getItem('access_token');

  if (hasSignalToken || hasStorageToken) {
    if (!hasSignalToken && hasStorageToken) {
      authService.currentUserToken.set(sessionStorage.getItem('access_token'));
    }

    return true;
  }

  console.warn('ACCESO DENEGADO');
  router.navigate(['/login']);
  return false;
};
