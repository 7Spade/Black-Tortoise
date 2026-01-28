/**
 * TaskDeletedEvent
 *
 * Layer: Domain
 * DDD Pattern: Domain Event
 *
 * Emitted when a task is deleted.
 */

import { DomainEvent } from '@tasks/events/domain-event';
import { EventType } from '@domain/events/event-type';

export interface TaskDeletedPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly deletedById: string;
}

export interface TaskDeletedEvent extends DomainEvent<TaskDeletedPayload> {
  readonly type: typeof EventType.TASK_DELETED;
}

export interface CreateTaskDeletedEventParams {
  taskId: string;
  workspaceId: string;
  deletedById: string;
  correlationId?: string;
  causationId?: string | null;
}

export function createTaskDeletedEvent(params: CreateTaskDeletedEventParams): TaskDeletedEvent {
  const { taskId, workspaceId, deletedById, correlationId, causationId } = params;
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;

  return {
    eventId,
    type: EventType.TASK_DELETED,
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      taskId,
      deletedById,
    },
  };
}
