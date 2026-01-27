import { Provider } from '@angular/core';
import { WORKSPACE_REPOSITORY } from '@application/interfaces/workspace-repository.token';
import { WORKSPACE_RUNTIME_FACTORY } from '@application/interfaces/workspace-runtime.token';
import { WorkspaceRuntimeFactory } from '@infrastructure/factories';
import { WorkspaceRepositoryImpl } from '@infrastructure/repositories';

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
