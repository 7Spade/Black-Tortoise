/**
 * TaskCreatedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a new task is created.
 */

import { DomainEvent, EventMetadata } from '@domain/event/domain-event';

export interface TaskCreatedPayload {
  readonly taskId: string;
  readonly title: string;
  readonly description: string;
  readonly priority: string;
  readonly createdById: string;
}

export interface TaskCreatedEvent extends DomainEvent<TaskCreatedPayload> {
  readonly eventType: 'TaskCreated';
}

export function createTaskCreatedEvent(
  taskId: string,
  workspaceId: string,
  title: string,
  description: string,
  priority: string,
  createdById: string,
  correlationId?: string,
  causationId?: string | null
): TaskCreatedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    eventType: 'TaskCreated',
    aggregateId: taskId,
    workspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      taskId,
      title,
      description,
      priority,
      createdById,
    },
    metadata: {
      version: 1,
      userId: createdById,
    },
  };
}
