import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GetTemplateByIdQuery } from '../queries/get-template.query';
import { GetTemplateUseCase } from '../use-cases/get-template.use-case';

export const canActivateTemplate: CanActivateFn = async (route, state) => {
  const getTemplateUseCase = inject(GetTemplateUseCase);
  const router = inject(Router);
  const id = route.params['id'];

  if (!id) return false;

  const template = await getTemplateUseCase.execute(new GetTemplateByIdQuery(id));
  
  if (template) {
    return true;
  } else {
    // Navigate to 404 or list
    return router.parseUrl('/not-found');
  }
};
