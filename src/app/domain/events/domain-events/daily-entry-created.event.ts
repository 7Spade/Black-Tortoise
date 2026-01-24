/**
 * DailyEntryCreatedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a daily work log entry is created.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface DailyEntryCreatedPayload {
  readonly entryId: string;
  readonly userId: string;
  readonly date: string;
  readonly taskIds: string[];
  readonly hoursLogged: number;
  readonly description: string;
}

export interface DailyEntryCreatedEvent extends DomainEvent<DailyEntryCreatedPayload> {
  readonly eventType: 'DailyEntryCreated';
}

export function createDailyEntryCreatedEvent(
  entryId: string,
  workspaceId: string,
  userId: string,
  date: string,
  taskIds: string[],
  hoursLogged: number,
  description: string,
  correlationId?: string,
  causationId?: string | null
): DailyEntryCreatedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    eventType: 'DailyEntryCreated',
    aggregateId: entryId,
    workspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      entryId,
      userId,
      date,
      taskIds,
      hoursLogged,
      description,
    },
    metadata: {
      version: 1,
      userId,
    },
  };
}
