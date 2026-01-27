import { Provider } from '@angular/core';
import { AUTH_REPOSITORY, AUTH_STREAM } from '@application/interfaces';
import { AuthRepositoryImpl } from '@infrastructure/repositories';

export function provideAuthInfrastructure(): Provider[] {
  return [
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepositoryImpl,
    },
    {
      provide: AUTH_STREAM,
      useClass: AuthRepositoryImpl,
    },
  ];
}
