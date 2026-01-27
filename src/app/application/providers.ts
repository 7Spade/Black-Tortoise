import {
  EnvironmentProviders,
  Provider,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { AuthStore } from './stores/auth.store';

export function provideApplication(): (Provider | EnvironmentProviders)[] {
  return [
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      authStore.connect();
    }),
  ];
}
