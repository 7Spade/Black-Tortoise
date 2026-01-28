import { Provider } from '@angular/core';
import { EVENT_BUS, EVENT_STORE } from '@application/interfaces';
import { InMemoryEventBus, InMemoryEventStore } from '@eventing/infrastructure';

export function provideEventsInfrastructure(): Provider[] {
  return [
    {
      provide: EVENT_BUS,
      useClass: InMemoryEventBus,
    },
    {
      provide: EVENT_STORE,
      useClass: InMemoryEventStore,
    },
  ];
}
