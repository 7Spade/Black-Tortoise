/**
 * Acceptance Approved Event
 * 
 * Layer: Domain
 * Purpose: Task has been approved in acceptance phase
 * Emitted by: Acceptance module
 */

import { DomainEvent, EventMetadata } from '@domain/event/domain-event';

export interface AcceptanceApprovedPayload {
  readonly taskId: string;
  readonly taskTitle: string;
  readonly approverId: string;
  readonly approvalNotes?: string;
}

export interface AcceptanceApprovedEvent extends DomainEvent<AcceptanceApprovedPayload> {
  readonly eventType: 'AcceptanceApproved';
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
  return {
    eventId: crypto.randomUUID(),
    eventType: 'AcceptanceApproved',
    aggregateId: taskId,
    workspaceId,
    timestamp: new Date(),
    correlationId: correlationId || crypto.randomUUID(),
    causationId: causationId || null,
    payload: {
      taskId,
      taskTitle,
      approverId,
      approvalNotes,
    },
    metadata: {
      version: 1,
      userId: approverId,
    },
  };
}
