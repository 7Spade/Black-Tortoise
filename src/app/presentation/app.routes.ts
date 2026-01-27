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
import { canActivateAuth, canActivatePublic } from '@application/guards';

export const routes: Routes = [
  // Landing Page (Public Home)
  {
    path: '',
    pathMatch: 'full',
    canActivate: [canActivatePublic],
    loadComponent: () =>
      import('@presentation/pages/landing').then(
        m => m.LandingPage
      ),
  },

  // Auth Routes
  {
    path: 'auth/login',
    canActivate: [canActivatePublic],
    loadComponent: () =>
      import('@presentation/pages/auth').then(
        m => m.LoginPage
      ),
  },
  {
    path: 'auth/register',
    canActivate: [canActivatePublic],
    loadComponent: () =>
        import('@presentation/pages/auth').then(
          m => m.RegisterPage
        ),
    },
    
    // Profile Page
    {
      path: 'profile',
      canActivate: [canActivateAuth],
      loadComponent: () =>
        import('@presentation/pages/profile').then(
          (m) => m.ProfileComponent
        ),
    },
  {
    path: 'auth/forgot-password',
    canActivate: [canActivatePublic],
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
    path: 'profile',
    canActivate: [canActivateAuth],
    loadComponent: () =>
      import('@presentation/pages/profile/profile.component').then(
        m => m.ProfileComponent
      ),
  },
  {
    path: 'settings',
    canActivate: [canActivateAuth],
    loadComponent: () =>
      import('@presentation/pages/settings').then(
        m => m.SettingsComponent
      ),
  },
  
  // Templates (Strict DDD Demo)
  {
    path: 'templates',
    canActivate: [canActivateAuth],
    loadChildren: () => import('../core/presentation/template.routes').then(m => m.TEMPLATE_ROUTES)
  },

  // Workspace page - contains workspace host with nested module routes
  {
    path: 'workspace',
    canActivate: [canActivateAuth],
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
