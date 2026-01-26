import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStore } from '@application/stores/auth.store';

/**
 * Auth Guard
 * 
 * Layer: Application
 * Responsibility: Protect routes based on Auth Status
 * Logic:
 * - Unknown -> ALLOW (Let UI handle splash state)
 * - Authenticated -> ALLOW
 * - Anonymous -> Redirect to /auth/login
 */
export const canActivateAuth: CanActivateFn = (route, state) => {
  const store = inject(AuthStore);
  const router = inject(Router);
  const status = store.status();

  if (status === 'unknown') {
    // Allow navigation to proceed, UI will show splash/skeleton
    return true;
  }

  if (status === 'authenticated') {
    return true;
  }

  // Status is anonymous -> Redirect to login
  // Pass returnUrl for redirect back after login
  return router.createUrlTree(['/auth/login'], { 
    queryParams: { returnUrl: state.url } 
  });
};

/**
 * Public Guard (Reverse)
 * Prevents authenticated users from seeing Login page again
 */
export const canActivatePublic: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);
  const status = store.status();

  if (status === 'authenticated') {
    return router.createUrlTree(['/workspace']);
  }

  return true;
};
