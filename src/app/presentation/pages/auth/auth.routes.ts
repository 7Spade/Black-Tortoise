import { Routes } from '@angular/router';
import { canActivatePublic } from '@application/guards';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [canActivatePublic],
    loadComponent: () =>
      import('@presentation/pages/auth').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    canActivate: [canActivatePublic],
    loadComponent: () =>
      import('@presentation/pages/auth').then((m) => m.RegisterPage),
  },
  {
    path: 'forgot-password',
    canActivate: [canActivatePublic],
    loadComponent: () =>
      import('@presentation/pages/auth').then((m) => m.ForgotPasswordPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
