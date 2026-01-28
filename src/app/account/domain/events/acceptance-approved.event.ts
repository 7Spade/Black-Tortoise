/**
 * Acceptance Approved Event
 * 
 * Layer: Domain
 * Purpose: Task has been approved in acceptance phase
 * Emitted by: Acceptance module
 */

import { DomainEvent } from '@domain/events';

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

export function createAcceptanceApprovedEvent(
  taskId: string,
  workspaceId: string,
  taskTitle: string,
  approverId: string,
  approvalNotes?: string,
  correlationId?: string,
  causationId?: string | null
): AcceptanceApprovedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  const payload: AcceptanceApprovedPayload = {
    workspaceId,
    taskId,
    taskTitle,
    approverId,
    ...(approvalNotes !== undefined ? { approvalNotes } : {}),
  };
  
  return {
    eventId,
    type: 'AcceptanceApproved',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}

