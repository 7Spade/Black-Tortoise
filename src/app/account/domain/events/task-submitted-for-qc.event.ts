/**
 * TaskSubmittedForQCEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a task is submitted for quality control.
 */

import { DomainEvent } from '@domain/events';

export interface TaskSubmittedForQCPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly taskTitle: string;
  readonly submittedById: string;
}

export interface TaskSubmittedForQCEvent extends DomainEvent<TaskSubmittedForQCPayload> {
  readonly type: 'TaskSubmittedForQC';
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
    type: 'TaskSubmittedForQC',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      taskId,
      taskTitle,
      submittedById,
    },
  };
}

