/**
 * Acceptance Approved Event
 * 
 * Layer: Domain
 * Purpose: Task has been approved in acceptance phase
 * Emitted by: Acceptance module
 */

import { DomainEvent } from '../../events/domain-event';

export interface AcceptanceApprovedPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly taskTitle: string;
  readonly approverId: string;
  readonly approvalNotes?: string;
}

export interface AcceptanceApprovedEvent extends DomainEvent<AcceptanceApprovedPayload> {
  readonly type: 'AcceptanceApproved';
}

export interface AcceptanceApprovedParams {
  taskId: string;
  workspaceId: string;
  taskTitle: string;
  approverId: string;
  approvalNotes?: string;
  correlationId?: string;
  causationId?: string | null;
}

export function createAcceptanceApprovedEvent(params: AcceptanceApprovedParams): AcceptanceApprovedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = params.correlationId ?? eventId;

  const payload: AcceptanceApprovedPayload = {
    workspaceId: params.workspaceId,
    taskId: params.taskId,
    taskTitle: params.taskTitle,
    approverId: params.approverId,
    ...(params.approvalNotes !== undefined ? { approvalNotes: params.approvalNotes } : {}),
  };

  return {
    eventId,
    type: 'AcceptanceApproved',
    aggregateId: params.taskId,
    correlationId: newCorrelationId,
    causationId: params.causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}

