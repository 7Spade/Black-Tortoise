import { Routes } from '@angular/router';

export const WORKSPACE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@modules/overview/presentation/overview.component').then(
        (m) => m.OverviewComponent,
      ),
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('@modules/overview/presentation/overview.component').then(
        (m) => m.OverviewComponent,
      ),
  },
  {
    path: 'documents',
    loadComponent: () =>
      import('@modules/documents/presentation/documents.component').then(
        (m) => m.DocumentsComponent,
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('@modules/tasks/presentation/tasks.component').then(
        (m) => m.TasksComponent,
      ),
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('@modules/calendar/presentation/calendar.component').then(
        (m) => m.CalendarComponent,
      ),
  },
  {
    path: 'daily',
    loadComponent: () =>
      import('@modules/daily/presentation/daily.component').then(
        (m) => m.DailyComponent,
      ),
  },
  {
    path: 'quality-control',
    loadComponent: () =>
      import('@modules/quality-control/presentation/quality-control.component').then(
        (m) => m.QualityControlComponent,
      ),
  },
  {
    path: 'acceptance',
    loadComponent: () =>
      import('@modules/acceptance/presentation/acceptance.component').then(
        (m) => m.AcceptanceComponent,
      ),
  },
  {
    path: 'issues',
    loadComponent: () =>
      import('@modules/issues/presentation/issues.component').then(
        (m) => m.IssuesComponent,
      ),
  },
  {
    path: 'members',
    loadComponent: () =>
      import('@modules/members/presentation/members.component').then(
        (m) => m.MembersComponent,
      ),
  },
  {
    path: 'permissions',
    loadComponent: () =>
      import('@modules/permissions/presentation/permissions.component').then(
        (m) => m.PermissionsComponent,
      ),
  },
  {
    path: 'audit',
    loadComponent: () =>
      import('@modules/audit/presentation/audit.component').then(
        (m) => m.AuditComponent,
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('@modules/settings/presentation/settings.component').then(
        (m) => m.SettingsComponent,
      ),
  },
];
