/**
 * Daily Entry Created Event
 * 
 * Layer: Domain
 * Purpose: Daily work log entry has been created
 * Emitted by: Daily module
 */

import { DomainEvent } from '@domain/events';

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
  
  const payload: DailyEntryCreatedPayload = {
    workspaceId,
    entryId,
    date,
    userId,
    taskIds,
    hoursLogged,
    ...(notes !== undefined ? { notes } : {}),
  };
  
  return {
    eventId,
    type: 'DailyEntryCreated',
    aggregateId: entryId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}

