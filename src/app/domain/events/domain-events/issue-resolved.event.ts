/**
 * IssueResolvedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when an issue is resolved, unblocking the task.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface IssueResolvedPayload {
  readonly issueId: string;
  readonly taskId: string;
  readonly resolvedById: string;
  readonly resolution: string;
}

export interface IssueResolvedEvent extends DomainEvent<IssueResolvedPayload> {
  readonly eventType: 'IssueResolved';
}

export function createIssueResolvedEvent(
  issueId: string,
  taskId: string,
  workspaceId: string,
  resolvedById: string,
  resolution: string,
  correlationId?: string,
  causationId?: string | null
): IssueResolvedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    eventType: 'IssueResolved',
    aggregateId: issueId,
    workspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      issueId,
      taskId,
      resolvedById,
      resolution,
    },
    metadata: {
      version: 1,
      userId: resolvedById,
    },
  };
}
