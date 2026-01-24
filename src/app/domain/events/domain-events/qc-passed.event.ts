/**
 * QCPassedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when quality control passes for a task.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface QCPassedPayload {
  readonly taskId: string;
  readonly taskTitle: string;
  readonly reviewedById: string;
  readonly reviewNotes?: string;
}

export interface QCPassedEvent extends DomainEvent<QCPassedPayload> {
  readonly eventType: 'QCPassed';
}

export function createQCPassedEvent(
  taskId: string,
  workspaceId: string,
  taskTitle: string,
  reviewedById: string,
  reviewNotes?: string,
  correlationId?: string,
  causationId?: string | null
): QCPassedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    eventType: 'QCPassed',
    aggregateId: taskId,
    workspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      taskId,
      taskTitle,
      reviewedById,
      reviewNotes,
    },
    metadata: {
      version: 1,
      userId: reviewedById,
    },
  };
}
