import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@application/stores/auth.store';

export const authGuard = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  return authStore.isAuthenticated() ? true : router.parseUrl('/auth/login');
};
