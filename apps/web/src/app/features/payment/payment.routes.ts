import { Routes } from '@angular/router';
import { paymentIntentResolver } from './payment.resolver';

export const PAYMENT_ROUTES: Routes = [
    {
        path: 'active-charge/:id',
        loadComponent: () => import('./active-charge.component').then(m => m.ActiveChargeComponent),
        resolve: {
            intent: paymentIntentResolver
        }
    },
    {
        path: 'confirmation/:id',
        loadComponent: () => import('./confirmation.component').then(m => m.ConfirmationComponent),
        resolve: {
            intent: paymentIntentResolver
        }
    }
];
