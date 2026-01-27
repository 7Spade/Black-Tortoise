import {
  EnvironmentProviders,
  Provider,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { AuthStore } from './stores/auth.store';
import { 
  OVERVIEW_CONTEXT, 
  OverviewContextProviderImpl,
  DAILY_CONTEXT,
  DailyContextProviderImpl,
} from './providers';

export function provideApplication(): (Provider | EnvironmentProviders)[] {
  return [
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      authStore.connect();
    }),
    {
      provide: OVERVIEW_CONTEXT,
      useClass: OverviewContextProviderImpl,
    },
    {
      provide: DAILY_CONTEXT,
      useClass: DailyContextProviderImpl,
    },
  ];
}
