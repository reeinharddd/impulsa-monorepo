import { Routes } from '@angular/router';

export const PERSON_ROUTES: Routes = [
    {
        path: 'charge',
        loadComponent: () => import('./charge/generate-charge.component').then(m => m.GenerateChargeComponent)
    },
    {
        path: 'history',
        loadComponent: () => import('./history/history.component').then(m => m.HistoryComponent)
    },
    {
        path: '',
        redirectTo: 'charge',
        pathMatch: 'full'
    }
];
