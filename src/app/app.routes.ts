/**
 * Application Routes
 * 
 * Domain-Driven Design: Application Layer Routing
 * Architecture: Zone-less, Lazy Loading with loadComponent
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./presentation/shell/global-shell.component').then(
        m => m.GlobalShellComponent
      ),
    children: [
      {
        path: 'overview',
        loadComponent: () =>
          import('./presentation/modules/demo-dashboard.module').then(
            m => m.DemoDashboardModule
          ),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./presentation/modules/demo-dashboard.module').then(
            m => m.DemoDashboardModule
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./presentation/modules/demo-dashboard.module').then(
            m => m.DemoDashboardModule
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./presentation/modules/demo-dashboard.module').then(
            m => m.DemoDashboardModule
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./presentation/modules/demo-settings.module').then(
            m => m.DemoSettingsModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
