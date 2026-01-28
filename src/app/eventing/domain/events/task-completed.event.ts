/**
 * TaskCompletedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a task is marked as completed.
 * Contains all information needed to track task completion in the event store.
 */

import { DomainEvent } from '@eventing/domain/events';

export interface TaskCompletedPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly taskName: string;
  readonly completedBy: string;
  readonly completionNotes?: string;
  readonly userId?: string;
}

export interface TaskCompletedEvent extends DomainEvent<TaskCompletedPayload> {
  readonly type: 'TaskCompleted';
}

/**
 * Create a TaskCompletedEvent
 */
export function createTaskCompletedEvent(
  taskId: string,
  taskName: string,
  completedBy: string,
  workspaceId: string,
  completionNotes?: string,
  userId?: string,
  correlationId?: string,
  causationId?: string | null
): TaskCompletedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  const payload: TaskCompletedPayload = {
    workspaceId,
    taskId,
    taskName,
    completedBy,
    ...(completionNotes !== undefined ? { completionNotes } : {}),
    ...(userId !== undefined ? { userId } : {}),
  };
  
  return {
    eventId,
    type: 'TaskCompleted',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}

