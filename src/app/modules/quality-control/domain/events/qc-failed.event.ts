/**
 * QCFailedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when quality control fails for a task.
 */

import { DomainEvent } from '@quality-control/events/domain-event';

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

export interface QCFailedParams {
  taskId: string;
  workspaceId: string;
  taskTitle: string;
  failureReason: string;
  reviewedById: string;
  correlationId?: string;
  causationId?: string | null;
}

export function createQCFailedEvent(params: QCFailedParams): QCFailedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = params.correlationId ?? eventId;

  return {
    eventId,
    type: 'QCFailed',
    aggregateId: params.taskId,
    correlationId: newCorrelationId,
    causationId: params.causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId: params.workspaceId,
      taskId: params.taskId,
      taskTitle: params.taskTitle,
      failureReason: params.failureReason,
      reviewedById: params.reviewedById,
    },
  };
}

