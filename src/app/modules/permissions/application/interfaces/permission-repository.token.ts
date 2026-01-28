import { InjectionToken } from '@angular/core';
import { PermissionRepository } from '@permissions/domain';

export const PERMISSION_REPOSITORY = new InjectionToken<PermissionRepository>('PERMISSION_REPOSITORY');
