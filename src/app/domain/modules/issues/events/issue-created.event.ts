/**
 * IssueCreatedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when an issue is created (typically from QC failure).
 */

import { DomainEvent } from '@domain/shared/events/domain-event';

export interface IssueCreatedPayload {
  readonly workspaceId: string;
  readonly issueId: string;
  readonly taskId: string;
  readonly title: string;
  readonly description: string;
  readonly createdById: string;
}

export interface IssueCreatedEvent extends DomainEvent<IssueCreatedPayload> {
  readonly type: 'IssueCreated';
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
    type: 'IssueCreated',
    aggregateId: issueId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      issueId,
      taskId,
      title,
      description,
      createdById,
    },
  };
}

