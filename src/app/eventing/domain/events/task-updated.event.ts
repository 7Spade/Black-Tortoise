/**
 * TaskUpdatedEvent
 *
 * Layer: Domain
 * DDD Pattern: Domain Event
 *
 * Emitted when a task is updated.
 */

import { TaskAggregate } from '@domain/aggregates';
import { DomainEvent } from '@eventing/domain/events';
import { EventType } from '@eventing/domain/events/event-type';

export interface TaskUpdatedPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly changes: Partial<TaskAggregate>;
  readonly updatedById: string;
}

export interface TaskUpdatedEvent extends DomainEvent<TaskUpdatedPayload> {
  readonly type: typeof EventType.TASK_UPDATED;
}

export function createTaskUpdatedEvent(
  taskId: string,
  workspaceId: string,
  changes: Partial<TaskAggregate>,
  updatedById: string,
  correlationId?: string,
  causationId?: string | null,
): TaskUpdatedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;

  return {
    eventId,
    type: EventType.TASK_UPDATED,
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      taskId,
      changes,
      updatedById,
    },
  };
}
