/**
 * QC Passed Event
 * 
 * Layer: Domain
 * Purpose: Task has passed quality control
 * Emitted by: QualityControl module
 */

import { DomainEvent, EventMetadata } from '@domain/event/domain-event';

export interface QCPassedPayload {
  readonly taskId: string;
  readonly taskTitle: string;
  readonly reviewerId: string;
  readonly reviewNotes?: string;
}

export interface QCPassedEvent extends DomainEvent<QCPassedPayload> {
  readonly eventType: 'QCPassed';
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
  return {
    eventId: crypto.randomUUID(),
    eventType: 'QCPassed',
    aggregateId: taskId,
    workspaceId,
    timestamp: new Date(),
    correlationId: correlationId || crypto.randomUUID(),
    causationId: causationId || null,
    payload: {
      taskId,
      taskTitle,
      reviewerId,
      reviewNotes,
    },
    metadata: {
      version: 1,
      userId: reviewerId,
    },
  };
}
