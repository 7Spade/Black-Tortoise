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
          import('@presentation/workspaces/modules/overview.module').then(
            m => m.OverviewModule
          ),
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('@presentation/workspaces/modules/overview.module').then(
            m => m.OverviewModule
          ),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('@presentation/workspaces/modules/documents.module').then(
            m => m.DocumentsModule
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('@presentation/workspaces/modules/tasks.module').then(
            m => m.TasksModule
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('@presentation/workspaces/modules/calendar.module').then(
            m => m.CalendarModule
          ),
      },
      {
        path: 'daily',
        loadComponent: () =>
          import('@presentation/workspaces/modules/daily.module').then(
            m => m.DailyModule
          ),
      },
      {
        path: 'quality-control',
        loadComponent: () =>
          import('@presentation/workspaces/modules/quality-control.module').then(
            m => m.QualityControlModule
          ),
      },
      {
        path: 'acceptance',
        loadComponent: () =>
          import('@presentation/workspaces/modules/acceptance.module').then(
            m => m.AcceptanceModule
          ),
      },
      {
        path: 'issues',
        loadComponent: () =>
          import('@presentation/workspaces/modules/issues.module').then(
            m => m.IssuesModule
          ),
      },
      {
        path: 'members',
        loadComponent: () =>
          import('@presentation/workspaces/modules/members.module').then(
            m => m.MembersModule
          ),
      },
      {
        path: 'permissions',
        loadComponent: () =>
          import('@presentation/workspaces/modules/permissions.module').then(
            m => m.PermissionsModule
          ),
      },
      {
        path: 'audit',
        loadComponent: () =>
          import('@presentation/workspaces/modules/audit.module').then(
            m => m.AuditModule
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('@presentation/workspaces/modules/settings.module').then(
            m => m.SettingsModule
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
