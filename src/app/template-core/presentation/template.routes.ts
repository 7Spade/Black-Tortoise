import { Routes } from '@angular/router';

export const TEMPLATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/template-list-page/template-list-page.component')
      .then(m => m.TemplateListPageComponent)
  }
];
