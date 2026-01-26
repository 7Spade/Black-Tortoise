import { InjectionToken } from '@angular/core';
import { WorkspaceRepository } from '@domain/repositories';

export const WORKSPACE_REPOSITORY = new InjectionToken<WorkspaceRepository>(
  'WORKSPACE_REPOSITORY'
);
