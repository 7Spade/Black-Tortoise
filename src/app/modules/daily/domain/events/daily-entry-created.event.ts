/**
 * Daily Entry Created Event
 * 
 * Layer: Domain
 * Purpose: Daily work log entry has been created
 * Emitted by: Daily module
 */

import { DomainEvent } from '@daily/events/domain-event';

export interface DailyEntryCreatedPayload {
  readonly workspaceId: string;
  readonly entryId: string;
  readonly date: string;
  readonly userId: string;
  readonly taskIds: string[];
  readonly headcount: number;
  readonly notes?: string;
}

export interface DailyEntryCreatedEvent extends DomainEvent<DailyEntryCreatedPayload> {
  readonly type: 'DailyEntryCreated';
}

export interface CreateDailyEntryCreatedEventParams {
  entryId: string;
  workspaceId: string;
  date: string;
  userId: string;
  taskIds: string[];
  headcount: number;
  notes?: string;
  correlationId?: string;
  causationId?: string | null;
}

export function createDailyEntryCreatedEvent(params: CreateDailyEntryCreatedEventParams): DailyEntryCreatedEvent {
  const {
    entryId,
    workspaceId,
    date,
    userId,
    taskIds,
    headcount,
    notes,
    correlationId,
    causationId
  } = params;

  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;

  const payload: DailyEntryCreatedPayload = {
    workspaceId,
    entryId,
    date,
    userId,
    taskIds,
    headcount,
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

