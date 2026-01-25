/**
 * Daily Event Handlers
 * 
 * Layer: Application - Event Handlers
 * Purpose: Register event handlers for Daily domain events
 * 
 * Responsibilities:
 * - Subscribe to DailyEntryCreated events
 * - Delegate to DailyStore for state mutations
 * - Event-driven state management (react pattern)
 */

import { inject } from '@angular/core';
import { EventBus } from '@domain/event-bus/event-bus.interface';
import { DailyEntryCreatedEvent } from '@domain/events/domain-events';
import { DailyStore } from '../stores/daily.store';

export function registerDailyEventHandlers(eventBus: EventBus): void {
  const dailyStore = inject(DailyStore);
  
  eventBus.subscribe<DailyEntryCreatedEvent>(
    'DailyEntryCreated',
    (event) => {
      console.log('[DailyEventHandlers] DailyEntryCreatedEvent:', event);
      dailyStore.createEntry({
        date: event.payload.date,
        userId: event.payload.userId,
        taskIds: event.payload.taskIds,
        hoursLogged: event.payload.hoursLogged,
        notes: event.payload.notes,
      });
    }
  );
  
  console.log('[DailyEventHandlers] Registered event handlers for workspace');
}
