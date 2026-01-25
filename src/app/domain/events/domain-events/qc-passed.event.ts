/**
 * QC Passed Event
 * 
 * Layer: Domain
 * Purpose: Task has passed quality control
 * Emitted by: QualityControl module
 */

import { DomainEvent } from '@domain/event/domain-event';

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

export function createQCPassedEvent(
  taskId: string,
  workspaceId: string,
  taskTitle: string,
  reviewerId: string,
  reviewNotes?: string,
  correlationId?: string,
  causationId?: string | null
): QCPassedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    type: 'QCPassed',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      taskId,
      taskTitle,
      reviewerId,
      reviewNotes,
    },
  };
}
