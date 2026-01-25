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
  readonly workspaceId: string;
  readonly issueId: string;
  readonly taskId: string;
  readonly resolvedById: string;
  readonly resolution: string;
}

export interface IssueResolvedEvent extends DomainEvent<IssueResolvedPayload> {
  readonly type: 'IssueResolved';
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
    type: 'IssueResolved',
    aggregateId: issueId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      issueId,
      taskId,
      resolvedById,
      resolution,
    },
  };
}
