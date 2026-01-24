/**
 * AcceptanceFailedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when acceptance testing fails for a task.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface AcceptanceFailedPayload {
  readonly taskId: string;
  readonly taskTitle: string;
  readonly rejectedById: string;
  readonly failureReason: string;
  readonly failedChecklistItems?: string[];
}

export interface AcceptanceFailedEvent extends DomainEvent<AcceptanceFailedPayload> {
  readonly eventType: 'AcceptanceFailed';
}

export function createAcceptanceFailedEvent(
  taskId: string,
  workspaceId: string,
  taskTitle: string,
  rejectedById: string,
  failureReason: string,
  failedChecklistItems?: string[],
  correlationId?: string,
  causationId?: string | null
): AcceptanceFailedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    eventType: 'AcceptanceFailed',
    aggregateId: taskId,
    workspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      taskId,
      taskTitle,
      rejectedById,
      failureReason,
      failedChecklistItems,
    },
    metadata: {
      version: 1,
      userId: rejectedById,
    },
  };
}
