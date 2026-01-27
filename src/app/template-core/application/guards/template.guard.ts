import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TEMPLATE_REPOSITORY_TOKEN } from '../interfaces/template.repository';

export const canActivateTemplate: CanActivateFn = async (route, state) => {
  const repository = inject(TEMPLATE_REPOSITORY_TOKEN);
  const router = inject(Router);
  const id = route.params['id'];

  if (!id) return false;

  const template = await repository.findById(id);
  
  if (template) {
    return true;
  } else {
    // Navigate to 404 or list
    return router.parseUrl('/not-found');
  }
};
