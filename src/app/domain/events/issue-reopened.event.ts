/**
 * IssueReopened Event
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a resolved or closed issue is reopened.
 */

import { DomainEvent } from '@domain/events';

export interface IssueReopenedPayload {
  readonly workspaceId: string;
  readonly issueId: string;
  readonly taskId?: string;
  readonly reopenedBy: string;
  readonly reopenReason?: string;
}

export interface IssueReopenedEvent extends DomainEvent<IssueReopenedPayload> {
  readonly type: 'IssueReopened';
}

export function createIssueReopenedEvent(
  issueId: string,
  workspaceId: string,
  reopenedBy: string,
  taskId?: string,
  reopenReason?: string,
  correlationId?: string,
  causationId?: string | null
): IssueReopenedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    type: 'IssueReopened',
    aggregateId: issueId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      issueId,
      reopenedBy,
      ...(taskId !== undefined ? { taskId } : {}),
      ...(reopenReason !== undefined ? { reopenReason } : {}),
    },
  };
}
