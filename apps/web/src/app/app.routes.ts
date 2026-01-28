import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/landing/landing.routes').then((m) => m.LANDING_ROUTES),
    title: 'PAGES.WELCOME.TITLE',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'error',
    loadChildren: () => import('./features/errors/errors.routes').then((m) => m.ERROR_ROUTES),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
        title: 'PAGES.DASHBOARD.TITLE',
      },
      {
        path: 'pos',
        loadChildren: () => import('./features/pos/pos.routes').then((m) => m.POS_ROUTES),
        title: 'PAGES.POS.TITLE',
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./features/inventory/inventory.routes').then((m) => m.INVENTORY_ROUTES),
        title: 'PAGES.INVENTORY.TITLE',
      },
      {
        path: 'orders',
        loadChildren: () => import('./features/orders/orders.routes').then((m) => m.ORDERS_ROUTES),
        title: 'PAGES.ORDERS.TITLE',
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
        title: 'PAGES.SETTINGS.TITLE',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];
