/**
 * Application Routes
 * 
 * Domain-Driven Design: Application Layer Routing
 * Architecture: Zone-less, Lazy Loading with loadComponent
 * 
 * Route Structure:
 * - /demo - Demo dashboard (showcase of DDD architecture)
 * - /workspace - Workspace host with all workspace modules
 * - Default entry: /demo
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
      // Demo route - presentation-only dashboard
      {
        path: 'demo',
        loadComponent: () =>
          import('./presentation/features/dashboard').then(
            m => m.DemoDashboardComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./presentation/features/settings').then(
            m => m.SettingsEntryComponent
          ),
      },
      
      // Workspace routes - actual workspace with modules
      {
        path: 'workspace',
        loadComponent: () =>
          import('./presentation/workspace-host/workspace-host.component').then(
            m => m.WorkspaceHostComponent
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./presentation/modules/overview.module').then(
                m => m.OverviewModule
              ),
          },
          {
            path: 'overview',
            loadComponent: () =>
              import('./presentation/modules/overview.module').then(
                m => m.OverviewModule
              ),
          },
          {
            path: 'documents',
            loadComponent: () =>
              import('./presentation/modules/documents.module').then(
                m => m.DocumentsModule
              ),
          },
          {
            path: 'tasks',
            loadComponent: () =>
              import('./presentation/modules/tasks.module').then(
                m => m.TasksModule
              ),
          },
          {
            path: 'calendar',
            loadComponent: () =>
              import('./presentation/modules/calendar.module').then(
                m => m.CalendarModule
              ),
          },
          {
            path: 'daily',
            loadComponent: () =>
              import('./presentation/modules/daily.module').then(
                m => m.DailyModule
              ),
          },
          {
            path: 'quality-control',
            loadComponent: () =>
              import('./presentation/modules/quality-control.module').then(
                m => m.QualityControlModule
              ),
          },
          {
            path: 'acceptance',
            loadComponent: () =>
              import('./presentation/modules/acceptance.module').then(
                m => m.AcceptanceModule
              ),
          },
          {
            path: 'issues',
            loadComponent: () =>
              import('./presentation/modules/issues.module').then(
                m => m.IssuesModule
              ),
          },
          {
            path: 'members',
            loadComponent: () =>
              import('./presentation/modules/members.module').then(
                m => m.MembersModule
              ),
          },
          {
            path: 'permissions',
            loadComponent: () =>
              import('./presentation/modules/permissions.module').then(
                m => m.PermissionsModule
              ),
          },
          {
            path: 'audit',
            loadComponent: () =>
              import('./presentation/modules/audit.module').then(
                m => m.AuditModule
              ),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./presentation/modules/settings.module').then(
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
    ],
  },
  {
    path: '**',
    redirectTo: 'demo',
    pathMatch: 'full',
  },
];
