/**
 * Application Routes
 * 
 * Domain-Driven Design: Application Layer Routing
 * Architecture: Zone-less, Lazy Loading with loadComponent
 * 
 * This routing configuration uses Angular's modern loadComponent pattern
 * for lazy loading standalone components without NgModules.
 * 
 * Zone-less Compliance:
 * - All lazy-loaded components are standalone
 * - Components use OnPush change detection
 * - No zone-based initialization hooks
 * - Routes are compatible with zone-less mode
 * 
 * DDD Boundaries:
 * - Routes map to Presentation layer components
 * - Components inject Application layer stores
 * - Stores manage Domain layer models
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/demo-context',
    pathMatch: 'full',
  },
  {
    path: 'demo-context',
    loadComponent: () => 
      import('@presentation/demo-context-page/demo-context-page.component').then(
        m => m.DemoContextPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/demo-context',
  },
];
