/**
 * TaskCreatedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a new task is created.
 */

import { DomainEvent } from '../../events/domain-event';
import { TaskPriority } from '@domain/aggregates';

export interface TaskCreatedPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly title: string;
  readonly description: string;
  readonly priority: TaskPriority;
  readonly createdById: string;
}

export interface TaskCreatedEvent extends DomainEvent<TaskCreatedPayload> {
  readonly type: 'TaskCreated';
}

export interface CreateTaskCreatedEventParams {
  taskId: string;
  workspaceId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  createdById: string;
  correlationId?: string;
  causationId?: string | null;
}

export function createTaskCreatedEvent(params: CreateTaskCreatedEventParams): TaskCreatedEvent {
  const { taskId, workspaceId, title, description, priority, createdById, correlationId, causationId } = params;
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;

  return {
    eventId,
    type: 'TaskCreated',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      taskId,
      title,
      description,
      priority,
      createdById,
    },
  };
}



