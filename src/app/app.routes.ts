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
          import('./presentation/pages/dashboard').then(
            m => m.DemoDashboardComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./presentation/features/settings').then(
            m => m.SettingsComponent
          ),
      },
      
      // Workspace routes - actual workspace with modules
      {
        path: 'workspace',
        loadComponent: () =>
          import('./presentation/containers/workspace-host/workspace-host.component').then(
            m => m.WorkspaceHostComponent
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./presentation/containers/workspace-modules/overview.module').then(
                m => m.OverviewModule
              ),
          },
          {
            path: 'overview',
            loadComponent: () =>
              import('./presentation/containers/workspace-modules/overview.module').then(
                m => m.OverviewModule
              ),
          },
          {
            path: 'documents',
            loadComponent: () =>
              import('./presentation/containers/workspace-modules/documents.module').then(
                m => m.DocumentsModule
              ),
          },
          {
            path: 'tasks',
            loadComponent: () =>
              import('./presentation/containers/workspace-modules/tasks.module').then(
                m => m.TasksModule
              ),
          },
          {
            path: 'calendar',
            loadComponent: () =>
              import('./presentation/containers/workspace-modules/calendar.module').then(
                m => m.CalendarModule
              ),
          },
          {
            path: 'daily',
            loadComponent: () =>
              import('./presentation/containers/workspace-modules/daily.module').then(
                m => m.DailyModule
              ),
          },
          {
            path: 'quality-control',
            loadComponent: () =>
              import('./presentation/containers/workspace-modules/quality-control.module').then(
                m => m.QualityControlModule
              ),
          },
          {
            path: 'acceptance',
            loadComponent: () =>
              import('./presentation/containers/workspace-modules/acceptance.module').then(
                m => m.AcceptanceModule
              ),
          },
          {
            path: 'issues',
            loadComponent: () =>
              import('./presentation/containers/workspace-modules/issues.module').then(
                m => m.IssuesModule
              ),
          },
          {
            path: 'members',
            loadComponent: () =>
              import('./presentation/containers/workspace-modules/members.module').then(
                m => m.MembersModule
              ),
          },
          {
            path: 'permissions',
            loadComponent: () =>
              import('./presentation/containers/workspace-modules/permissions.module').then(
                m => m.PermissionsModule
              ),
          },
          {
            path: 'audit',
            loadComponent: () =>
              import('./presentation/containers/workspace-modules/audit.module').then(
                m => m.AuditModule
              ),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./presentation/containers/workspace-modules/settings.module').then(
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
