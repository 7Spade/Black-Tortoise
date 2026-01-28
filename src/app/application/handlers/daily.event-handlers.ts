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
import { DailyEntryCreatedEvent } from '@eventing/domain/events';
import { EventBus } from '@eventing/domain/interfaces';
import { DailyEntry, DailyStore } from '../stores/daily.store';

export function registerDailyEventHandlers(eventBus: EventBus): void {
  const dailyStore = inject(DailyStore);
  
  eventBus.subscribe<DailyEntryCreatedEvent['payload']>(
    'DailyEntryCreated',
    (event) => {
      console.log('[DailyEventHandlers] DailyEntryCreatedEvent:', event);
      const entry: Omit<DailyEntry, 'id' | 'createdAt'> = {
        date: event.payload.date,
        userId: event.payload.userId,
        taskIds: event.payload.taskIds,
        headcount: event.payload.headcount,
        ...(event.payload.notes !== undefined ? { notes: event.payload.notes } : {}),
      };
      dailyStore.createEntry(entry);
    }
  );
  
  console.log('[DailyEventHandlers] Registered event handlers for workspace');
}



