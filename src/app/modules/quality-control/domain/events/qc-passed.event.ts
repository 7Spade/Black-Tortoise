/**
 * QC Passed Event
 * 
 * Layer: Domain
 * Purpose: Task has passed quality control
 * Emitted by: QualityControl module
 */

import { DomainEvent } from '@quality-control/events/domain-event';

export interface QCPassedPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly taskTitle: string;
  readonly reviewerId: string;
  readonly reviewNotes?: string;
}

export interface QCPassedEvent extends DomainEvent<QCPassedPayload> {
  readonly type: 'QCPassed';
}

export interface QCPassedParams {
  taskId: string;
  workspaceId: string;
  taskTitle: string;
  reviewerId: string;
  reviewNotes?: string;
  correlationId?: string;
  causationId?: string | null;
}

export function createQCPassedEvent(params: QCPassedParams): QCPassedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = params.correlationId ?? eventId;

  const payload: QCPassedPayload = {
    workspaceId: params.workspaceId,
    taskId: params.taskId,
    taskTitle: params.taskTitle,
    reviewerId: params.reviewerId,
    ...(params.reviewNotes !== undefined ? { reviewNotes: params.reviewNotes } : {}),
  };

  return {
    eventId,
    type: 'QCPassed',
    aggregateId: params.taskId,
    correlationId: newCorrelationId,
    causationId: params.causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}

