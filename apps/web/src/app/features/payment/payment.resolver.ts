import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { PaymentIntent } from '@core/models/payment/payment-intent.model';
import { MockApiService } from '@core/services/auth/mock-api.service';

export const paymentIntentResolver: ResolveFn<PaymentIntent> = (route) => {
  const api = inject(MockApiService);
  const router = inject(Router);
  const id = route.paramMap.get('id');

  if (!id) {
    router.navigate(['/app']);
    throw new Error('Payment ID required');
  }

  const intent = api.getPaymentIntent(id);

  if (!intent) {
    router.navigate(['/app']); // Redirect if not found
    throw new Error('Payment Intent not found');
  }

  return intent;
};
