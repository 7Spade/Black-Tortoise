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

export const routes: Routes = [
  // Auth Routes
  {
    path: 'auth/login',
    loadComponent: () =>
      import('@presentation/pages/auth').then(
        m => m.LoginPage
      ),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('@presentation/pages/auth').then(
        m => m.RegisterPage
      ),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('@presentation/pages/auth').then(
        m => m.ForgotPasswordPage
      ),
  },

  // Demo route - presentation-only dashboard
  {
    path: 'demo',
    loadComponent: () =>
      import('@presentation/pages/dashboard').then(
        m => m.DemoDashboardComponent
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('@presentation/pages/settings').then(
        m => m.SettingsComponent
      ),
  },
  
  // Workspace page - contains workspace host with nested module routes
  {
    path: 'workspace',
    loadComponent: () =>
      import('@presentation/pages/workspace').then(
        m => m.WorkspacePage
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@presentation/components/overview.component').then(
            m => m.OverviewComponent
          ),
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('@presentation/components/overview.component').then(
            m => m.OverviewComponent
          ),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('@presentation/components/documents.component').then(
            m => m.DocumentsComponent
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('@presentation/components/tasks.component').then(
            m => m.TasksComponent
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('@presentation/components/calendar.component').then(
            m => m.CalendarComponent
          ),
      },
      {
        path: 'daily',
        loadComponent: () =>
          import('@presentation/components/daily.component').then(
            m => m.DailyComponent
          ),
      },
      {
        path: 'quality-control',
        loadComponent: () =>
          import('@presentation/components/quality-control.component').then(
            m => m.QualityControlComponent
          ),
      },
      {
        path: 'acceptance',
        loadComponent: () =>
          import('@presentation/components/acceptance.component').then(
            m => m.AcceptanceComponent
          ),
      },
      {
        path: 'issues',
        loadComponent: () =>
          import('@presentation/components/issues.component').then(
            m => m.IssuesComponent
          ),
      },
      {
        path: 'members',
        loadComponent: () =>
          import('@presentation/components/members.component').then(
            m => m.MembersComponent
          ),
      },
      {
        path: 'permissions',
        loadComponent: () =>
          import('@presentation/components/permissions.component').then(
            m => m.PermissionsComponent
          ),
      },
      {
        path: 'audit',
        loadComponent: () =>
          import('@presentation/components/audit.component').then(
            m => m.AuditComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('@presentation/components/settings.component').then(
            m => m.SettingsComponent
          ),
      },
    ],
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
