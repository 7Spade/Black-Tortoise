import { InjectionToken } from '@angular/core';
import { PermissionRepository } from '@domain/repositories';

export const PERMISSION_REPOSITORY = new InjectionToken<PermissionRepository>('PERMISSION_REPOSITORY');
