/**
 * TaskStatusChangedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a task status changes.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface TaskStatusChangedPayload {
  readonly taskId: string;
  readonly taskTitle: string;
  readonly previousStatus: string;
  readonly newStatus: string;
  readonly changedById: string;
  readonly reason?: string;
}

export interface TaskStatusChangedEvent extends DomainEvent<TaskStatusChangedPayload> {
  readonly eventType: 'TaskStatusChanged';
}

export function createTaskStatusChangedEvent(
  taskId: string,
  workspaceId: string,
  taskTitle: string,
  previousStatus: string,
  newStatus: string,
  changedById: string,
  reason?: string,
  correlationId?: string,
  causationId?: string | null
): TaskStatusChangedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    eventType: 'TaskStatusChanged',
    aggregateId: taskId,
    workspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      taskId,
      taskTitle,
      previousStatus,
      newStatus,
      changedById,
      reason,
    },
    metadata: {
      version: 1,
      userId: changedById,
    },
  };
}
