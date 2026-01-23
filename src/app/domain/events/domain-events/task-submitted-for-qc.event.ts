/**
 * TaskSubmittedForQCEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a task is submitted for quality control.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface TaskSubmittedForQCPayload {
  readonly taskId: string;
  readonly taskTitle: string;
  readonly submittedById: string;
}

export interface TaskSubmittedForQCEvent extends DomainEvent<TaskSubmittedForQCPayload> {
  readonly eventType: 'TaskSubmittedForQC';
}

export function createTaskSubmittedForQCEvent(
  taskId: string,
  workspaceId: string,
  taskTitle: string,
  submittedById: string,
  correlationId?: string,
  causationId?: string | null
): TaskSubmittedForQCEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    eventType: 'TaskSubmittedForQC',
    aggregateId: taskId,
    workspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      taskId,
      taskTitle,
      submittedById,
    },
    metadata: {
      version: 1,
      userId: submittedById,
    },
  };
}
