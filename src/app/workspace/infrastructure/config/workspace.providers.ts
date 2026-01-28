import { Provider } from '@angular/core';
import { WORKSPACE_REPOSITORY, WORKSPACE_RUNTIME_FACTORY } from '@workspace/application';
import { WorkspaceRuntimeFactory } from '../factories/workspace-runtime.factory';
import { WorkspaceRepositoryImpl } from '../repositories/workspace.repository.impl';

export function provideWorkspaceInfrastructure(): Provider[] {
  return [
    {
      provide: WORKSPACE_RUNTIME_FACTORY,
      useClass: WorkspaceRuntimeFactory,
    },
    {
      provide: WORKSPACE_REPOSITORY,
      useClass: WorkspaceRepositoryImpl,
    },
  ];
}
