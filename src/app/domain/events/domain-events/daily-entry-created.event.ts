/**
 * Daily Entry Created Event
 * 
 * Layer: Domain
 * Purpose: Daily work log entry has been created
 * Emitted by: Daily module
 */

import { DomainEvent, EventMetadata } from '@domain/event/domain-event';

export interface DailyEntryCreatedPayload {
  readonly entryId: string;
  readonly date: string;
  readonly userId: string;
  readonly taskIds: string[];
  readonly hoursLogged: number;
  readonly notes?: string;
}

export interface DailyEntryCreatedEvent extends DomainEvent<DailyEntryCreatedPayload> {
  readonly eventType: 'DailyEntryCreated';
}

export function createDailyEntryCreatedEvent(
  entryId: string,
  workspaceId: string,
  date: string,
  userId: string,
  taskIds: string[],
  hoursLogged: number,
  notes?: string,
  correlationId?: string
): DailyEntryCreatedEvent {
  return {
    eventId: crypto.randomUUID(),
    eventType: 'DailyEntryCreated',
    aggregateId: entryId,
    workspaceId,
    timestamp: new Date(),
    correlationId: correlationId || crypto.randomUUID(),
    causationId: null,
    payload: {
      entryId,
      date,
      userId,
      taskIds,
      hoursLogged,
      notes,
    },
    metadata: {
      version: 1,
      userId,
    },
  };
}
