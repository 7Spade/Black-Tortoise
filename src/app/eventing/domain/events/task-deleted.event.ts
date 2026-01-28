/**
 * TaskDeletedEvent
 *
 * Layer: Domain
 * DDD Pattern: Domain Event
 *
 * Emitted when a task is deleted.
 */

import { DomainEvent } from '@eventing/domain/events';
import { EventType } from '@eventing/domain/events/event-type';

export interface TaskDeletedPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly deletedById: string;
}

export interface TaskDeletedEvent extends DomainEvent<TaskDeletedPayload> {
  readonly type: typeof EventType.TASK_DELETED;
}

export function createTaskDeletedEvent(
  taskId: string,
  workspaceId: string,
  deletedById: string,
  correlationId?: string,
  causationId?: string | null,
): TaskDeletedEvent {
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
