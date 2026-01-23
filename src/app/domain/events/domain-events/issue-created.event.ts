/**
 * IssueCreatedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when an issue is created (typically from QC failure).
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface IssueCreatedPayload {
  readonly issueId: string;
  readonly taskId: string;
  readonly title: string;
  readonly description: string;
  readonly createdById: string;
}

export interface IssueCreatedEvent extends DomainEvent<IssueCreatedPayload> {
  readonly eventType: 'IssueCreated';
}

export function createIssueCreatedEvent(
  issueId: string,
  taskId: string,
  workspaceId: string,
  title: string,
  description: string,
  createdById: string,
  correlationId?: string,
  causationId?: string | null
): IssueCreatedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    eventType: 'IssueCreated',
    aggregateId: issueId,
    workspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      issueId,
      taskId,
      title,
      description,
      createdById,
    },
    metadata: {
      version: 1,
      userId: createdById,
    },
  };
}
