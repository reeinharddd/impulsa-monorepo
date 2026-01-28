import { Routes } from '@angular/router';

export const ERROR_ROUTES: Routes = [
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Impulsa - Página no encontrada',
  },
  {
    path: '403',
    loadComponent: () =>
      import('./forbidden/forbidden.component').then((m) => m.ForbiddenComponent),
    title: 'Impulsa - Acceso denegado',
  },
];
