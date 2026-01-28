import { InjectionToken } from '@angular/core';
import { WorkspaceRepository } from '@workspace/domain';

export const WORKSPACE_REPOSITORY = new InjectionToken<WorkspaceRepository>(
  'WORKSPACE_REPOSITORY'
);
