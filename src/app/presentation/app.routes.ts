/**
 * Application Routes
 *
 * Layer: Presentation
 * Architecture: Zone-less, Lazy Loading with loadComponent
 *
 * Route Structure:
 * - Routes point ONLY to page components
 * - Shell is NEVER referenced in routes (rendered by app.component)
 * - /demo - Demo dashboard (showcase of DDD architecture)
 * - /workspace - Workspace page with workspace host and modules
 * - /settings - Settings page
 * - Default entry: /demo
 *
 * Constraints:
 * - NO RxJS in guards or routing
 * - NO shell component in route definitions
 * - NO top-level routes defined by workspace/organization domains
 */

import { Routes } from '@angular/router';
import {
  canActivateAuth,
  canActivatePublic,
  canActivateWorkspace,
} from '@application/guards';

export const routes: Routes = [
  // Landing Page (Public Home)
  {
    path: '',
    pathMatch: 'full',
    canActivate: [canActivatePublic],
    loadComponent: () =>
      import('@presentation/pages/landing').then((m) => m.LandingPage),
  },

  // Auth Routes
  {
    path: 'auth',
    loadChildren: () =>
      import('@presentation/pages/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // Profile Page
  {
    path: 'profile',
    canActivate: [canActivateAuth],
    loadComponent: () =>
      import('@presentation/pages/profile').then((m) => m.ProfileComponent),
  },

  // Demo route - presentation-only dashboard
  {
    path: 'demo',
    loadComponent: () =>
      import('@presentation/pages/dashboard').then(
        (m) => m.DemoDashboardComponent,
      ),
  },

  {
    path: 'settings',
    canActivate: [canActivateAuth],
    loadComponent: () =>
      import('@presentation/pages/settings').then((m) => m.SettingsComponent),
  },

  // Templates (Strict DDD Demo)
  {
    path: 'templates',
    canActivate: [canActivateAuth],
    loadChildren: () =>
      import('@template-core/presentation/template.routes').then(
        (m) => m.TEMPLATE_ROUTES,
      ),
  },

  // Workspace page - contains workspace host with nested module routes
  {
    path: 'workspace',
    canActivate: [canActivateAuth, canActivateWorkspace],
    loadComponent: () =>
      import('@presentation/pages/workspace').then((m) => m.WorkspacePage),
    loadChildren: () =>
      import('@presentation/pages/workspace/workspace.routes').then(
        (m) => m.WORKSPACE_ROUTES,
      ),
  },

  // Default: redirect to demo
  {
    path: '',
    redirectTo: 'demo',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'demo',
    pathMatch: 'full',
  },
];
