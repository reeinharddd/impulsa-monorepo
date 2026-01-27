import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login.component').then((m) => m.LoginComponent),
    title: 'Impulsa - Iniciar Sesión',
  },
  {
    path: 'register',
    loadComponent: () => import('./register.component').then((m) => m.RegisterComponent),
    title: 'Impulsa - Crear Cuenta',
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
