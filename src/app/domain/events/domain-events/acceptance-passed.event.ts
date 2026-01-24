/**
 * AcceptancePassedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when acceptance testing passes for a task.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface AcceptancePassedPayload {
  readonly taskId: string;
  readonly taskTitle: string;
  readonly acceptedById: string;
  readonly acceptanceNotes?: string;
  readonly checklistItems?: string[];
}

export interface AcceptancePassedEvent extends DomainEvent<AcceptancePassedPayload> {
  readonly eventType: 'AcceptancePassed';
}

export function createAcceptancePassedEvent(
  taskId: string,
  workspaceId: string,
  taskTitle: string,
  acceptedById: string,
  acceptanceNotes?: string,
  checklistItems?: string[],
  correlationId?: string,
  causationId?: string | null
): AcceptancePassedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    eventType: 'AcceptancePassed',
    aggregateId: taskId,
    workspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      taskId,
      taskTitle,
      acceptedById,
      acceptanceNotes,
      checklistItems,
    },
    metadata: {
      version: 1,
      userId: acceptedById,
    },
  };
}
