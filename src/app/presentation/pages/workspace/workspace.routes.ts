import { Routes } from '@angular/router';

export const WORKSPACE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@overview/presentation/pages/overview.component').then(
        (m) => m.OverviewComponent,
      ),
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('@overview/presentation/pages/overview.component').then(
        (m) => m.OverviewComponent,
      ),
  },
  {
    path: 'documents',
    loadComponent: () =>
      import('@documents/presentation/pages/documents.component').then(
        (m) => m.DocumentsComponent,
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('@tasks/presentation/pages/tasks.component').then(
        (m) => m.TasksComponent,
      ),
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('@calendar/presentation/pages/calendar.component').then(
        (m) => m.CalendarComponent,
      ),
  },
  {
    path: 'daily',
    loadComponent: () =>
      import('@daily/presentation/pages/daily.component').then(
        (m) => m.DailyComponent,
      ),
  },
  {
    path: 'quality-control',
    loadComponent: () =>
      import('@quality-control/presentation/pages/quality-control.component').then(
        (m) => m.QualityControlComponent,
      ),
  },
  {
    path: 'acceptance',
    loadComponent: () =>
      import('@acceptance/presentation/pages/acceptance.component').then(
        (m) => m.AcceptanceComponent,
      ),
  },
  {
    path: 'issues',
    loadComponent: () =>
      import('@issues/presentation/pages/issues.component').then(
        (m) => m.IssuesComponent,
      ),
  },
  {
    path: 'members',
    loadComponent: () =>
      import('@members/presentation/pages/members.component').then(
        (m) => m.MembersComponent,
      ),
  },
  {
    path: 'permissions',
    loadComponent: () =>
      import('@permissions/presentation/pages/permissions.component').then(
        (m) => m.PermissionsComponent,
      ),
  },
  {
    path: 'audit',
    loadComponent: () =>
      import('@audit/presentation/pages/audit.component').then(
        (m) => m.AuditComponent,
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('@settings/presentation/pages/settings.component').then(
        (m) => m.SettingsComponent,
      ),
  },
];
