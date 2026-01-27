import { Provider } from '@angular/core';
import {
  TEMPLATE_EVENT_BUS_TOKEN,
  TEMPLATE_EVENT_STORE_TOKEN,
} from './application/tokens/event-infrastructure.tokens';
import { TEMPLATE_REPOSITORY_TOKEN } from './application/tokens/template-repository.token';
import { TemplateFirestoreEventStore } from './infrastructure/event-sourcing/firestore-event-store';
import { TemplateRxJsEventBus } from './infrastructure/event-sourcing/rxjs-event-bus';
import { TemplateFirebaseRepository } from './infrastructure/repositories/template-firebase.repository';

export function provideTemplateCore(): Provider[] {
  return [
    {
      provide: TEMPLATE_REPOSITORY_TOKEN,
      useClass: TemplateFirebaseRepository,
    },
    {
      provide: TEMPLATE_EVENT_STORE_TOKEN,
      useClass: TemplateFirestoreEventStore,
    },
    {
      provide: TEMPLATE_EVENT_BUS_TOKEN,
      useClass: TemplateRxJsEventBus,
    },
  ];
}
