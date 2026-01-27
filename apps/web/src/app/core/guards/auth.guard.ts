import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MockApiService } from '../services/mock-api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const mockApi = inject(MockApiService);
  const router = inject(Router);

  if (mockApi.currentUser()) {
    return true;
  }

  return router.createUrlTree(['/auth']);
};
