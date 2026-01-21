import { InjectionToken } from '@angular/core';
import type { AuthRepository } from '@domain/identity/repositories/auth.repository.interface';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import type { MembershipRepository } from '@domain/membership/repositories/membership.repository.interface';
import type { ModuleRepository } from '@domain/modules/repositories/module.repository.interface';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';

export const IDENTITY_REPOSITORY = new InjectionToken<IdentityRepository>(
  'IDENTITY_REPOSITORY',
);

export const WORKSPACE_REPOSITORY = new InjectionToken<WorkspaceRepository>(
  'WORKSPACE_REPOSITORY',
);

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>(
  'AUTH_REPOSITORY',
);

export const MODULE_REPOSITORY = new InjectionToken<ModuleRepository>(
  'MODULE_REPOSITORY',
);

export const MEMBERSHIP_REPOSITORY = new InjectionToken<MembershipRepository>(
  'MEMBERSHIP_REPOSITORY',
);
