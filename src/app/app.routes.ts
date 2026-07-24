import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.page').then((m) => m.LandingPage),
    title: 'Bienvenidos | Stride',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then((m) => m.LoginPage),
    title: 'Iniciar Sesion',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.page').then((m) => m.RegisterPage),
    title: 'Crea tu cuenta',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage),
    title: 'Tablero | Stride',
    canActivate: [authGuard],
  },
  {
    path: 'board/:id',
    loadComponent: () =>
      import('./features/project-board/project-board.page').then((m) => m.ProjectBoardPage),
    title: 'Tablero Kanban | Stride',
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
