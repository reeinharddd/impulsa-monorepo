import { Routes } from '@angular/router';

export const BUSINESS_ROUTES: Routes = [
    {
        path: 'inventory',
        loadComponent: () => import('./inventory/inventory.component').then(m => m.InventoryComponent)
    },
    {
        path: 'sale',
        loadComponent: () => import('./sale/new-sale.component').then(m => m.NewSaleComponent)
    },
    {
        path: '',
        redirectTo: 'sale',
        pathMatch: 'full'
    }
];
