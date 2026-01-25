/**
 * Daily Entry Created Event
 * 
 * Layer: Domain
 * Purpose: Daily work log entry has been created
 * Emitted by: Daily module
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface DailyEntryCreatedPayload {
  readonly workspaceId: string;
  readonly entryId: string;
  readonly date: string;
  readonly userId: string;
  readonly taskIds: string[];
  readonly hoursLogged: number;
  readonly notes?: string;
}

export interface DailyEntryCreatedEvent extends DomainEvent<DailyEntryCreatedPayload> {
  readonly type: 'DailyEntryCreated';
}

export function createDailyEntryCreatedEvent(
  entryId: string,
  workspaceId: string,
  date: string,
  userId: string,
  taskIds: string[],
  hoursLogged: number,
  notes?: string,
  correlationId?: string,
  causationId?: string | null
): DailyEntryCreatedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    type: 'DailyEntryCreated',
    aggregateId: entryId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      entryId,
      date,
      userId,
      taskIds,
      hoursLogged,
      notes,
    },
  };
}
