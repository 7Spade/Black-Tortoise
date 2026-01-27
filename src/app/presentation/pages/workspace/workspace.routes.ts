import { Routes } from '@angular/router';

export const WORKSPACE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@presentation/components/overview.component').then(
        (m) => m.OverviewComponent
      ),
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('@presentation/components/overview.component').then(
        (m) => m.OverviewComponent
      ),
  },
  {
    path: 'documents',
    loadComponent: () =>
      import('@presentation/components/documents.component').then(
        (m) => m.DocumentsComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('@presentation/components/tasks.component').then(
        (m) => m.TasksComponent
      ),
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('@presentation/components/calendar.component').then(
        (m) => m.CalendarComponent
      ),
  },
  {
    path: 'daily',
    loadComponent: () =>
      import('@presentation/components/daily.component').then(
        (m) => m.DailyComponent
      ),
  },
  {
    path: 'quality-control',
    loadComponent: () =>
      import('@presentation/components/quality-control.component').then(
        (m) => m.QualityControlComponent
      ),
  },
  {
    path: 'acceptance',
    loadComponent: () =>
      import('@presentation/components/acceptance.component').then(
        (m) => m.AcceptanceComponent
      ),
  },
  {
    path: 'issues',
    loadComponent: () =>
      import('@presentation/components/issues.component').then(
        (m) => m.IssuesComponent
      ),
  },
  {
    path: 'members',
    loadComponent: () =>
      import('@presentation/components/members.component').then(
        (m) => m.MembersComponent
      ),
  },
  {
    path: 'permissions',
    loadComponent: () =>
      import('@presentation/components/permissions.component').then(
        (m) => m.PermissionsComponent
      ),
  },
  {
    path: 'audit',
    loadComponent: () =>
      import('@presentation/components/audit.component').then(
        (m) => m.AuditComponent
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('@presentation/components/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
];
