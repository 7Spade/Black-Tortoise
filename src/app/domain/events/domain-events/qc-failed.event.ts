/**
 * QCFailedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when quality control fails for a task.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface QCFailedPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly taskTitle: string;
  readonly failureReason: string;
  readonly reviewedById: string;
}

export interface QCFailedEvent extends DomainEvent<QCFailedPayload> {
  readonly type: 'QCFailed';
}

export function createQCFailedEvent(
  taskId: string,
  workspaceId: string,
  taskTitle: string,
  failureReason: string,
  reviewedById: string,
  correlationId?: string,
  causationId?: string | null
): QCFailedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    type: 'QCFailed',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      taskId,
      taskTitle,
      failureReason,
      reviewedById,
    },
  };
}
