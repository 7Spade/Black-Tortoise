/**
 * Acceptance Rejected Event
 * 
 * Layer: Domain
 * Purpose: Task has been rejected in acceptance phase
 * Emitted by: Acceptance module
 */

import { DomainEvent } from '@domain/events';

export interface AcceptanceRejectedPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly taskTitle: string;
  readonly rejectedById: string;
  readonly rejectionReason: string;
}

export interface AcceptanceRejectedEvent extends DomainEvent<AcceptanceRejectedPayload> {
  readonly type: 'AcceptanceRejected';
}

export function createAcceptanceRejectedEvent(
  taskId: string,
  workspaceId: string,
  taskTitle: string,
  rejectedById: string,
  rejectionReason: string,
  correlationId?: string,
  causationId?: string | null
): AcceptanceRejectedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    type: 'AcceptanceRejected',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      taskId,
      taskTitle,
      rejectedById,
      rejectionReason,
    },
  };
}

