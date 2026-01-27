/**
 * Role Repository Injection Token
 * 
 * Layer: Application
 * Purpose: Dependency injection token for IRoleRepository
 */

import { InjectionToken } from '@angular/core';
import { IRoleRepository } from '@application/ports/role-repository.port';

export const ROLE_REPOSITORY_TOKEN = new InjectionToken<IRoleRepository>(
  'ROLE_REPOSITORY_TOKEN',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error(
        'ROLE_REPOSITORY_TOKEN must be provided. Configure in app.config.ts or module providers.'
      );
    },
  }
);
