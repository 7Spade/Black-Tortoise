import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: ':mode',
    loadComponent: () =>
      import('./auth-page.component').then(
        (module) => module.AuthPageComponent,
      ),
  },
];
