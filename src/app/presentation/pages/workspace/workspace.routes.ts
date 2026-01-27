import { Routes } from '@angular/router';

export const WORKSPACE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@presentation/pages/modules/overview/overview.component').then(
        (m) => m.OverviewComponent,
      ),
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('@presentation/pages/modules/overview/overview.component').then(
        (m) => m.OverviewComponent,
      ),
  },
  {
    path: 'documents',
    loadComponent: () =>
      import('@presentation/pages/modules/documents/documents.component').then(
        (m) => m.DocumentsComponent,
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('@presentation/pages/modules/tasks/tasks.component').then(
        (m) => m.TasksComponent,
      ),
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('@presentation/pages/modules/calendar/calendar.component').then(
        (m) => m.CalendarComponent,
      ),
  },
  {
    path: 'daily',
    loadComponent: () =>
      import('@presentation/pages/modules/daily/daily.component').then(
        (m) => m.DailyComponent,
      ),
  },
  {
    path: 'quality-control',
    loadComponent: () =>
      import('@presentation/pages/modules/quality-control/quality-control.component').then(
        (m) => m.QualityControlComponent,
      ),
  },
  {
    path: 'acceptance',
    loadComponent: () =>
      import('@presentation/pages/modules/acceptance/acceptance.component').then(
        (m) => m.AcceptanceComponent,
      ),
  },
  {
    path: 'issues',
    loadComponent: () =>
      import('@presentation/pages/modules/issues/issues.component').then(
        (m) => m.IssuesComponent,
      ),
  },
  {
    path: 'members',
    loadComponent: () =>
      import('@presentation/pages/modules/members/members.component').then(
        (m) => m.MembersComponent,
      ),
  },
  {
    path: 'permissions',
    loadComponent: () =>
      import('@presentation/pages/modules/permissions/permissions.component').then(
        (m) => m.PermissionsComponent,
      ),
  },
  {
    path: 'audit',
    loadComponent: () =>
      import('@presentation/pages/modules/audit/audit.component').then(
        (m) => m.AuditComponent,
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('@presentation/pages/modules/settings/settings.component').then(
        (m) => m.SettingsComponent,
      ),
  },
];
