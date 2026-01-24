/**
 * Acceptance Rejected Event
 * 
 * Layer: Domain
 * Purpose: Task has been rejected in acceptance phase
 * Emitted by: Acceptance module
 */

import { DomainEvent, EventMetadata } from '@domain/event/domain-event';

export interface AcceptanceRejectedPayload {
  readonly taskId: string;
  readonly taskTitle: string;
  readonly rejectedById: string;
  readonly rejectionReason: string;
}

export interface AcceptanceRejectedEvent extends DomainEvent<AcceptanceRejectedPayload> {
  readonly eventType: 'AcceptanceRejected';
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
  return {
    eventId: crypto.randomUUID(),
    eventType: 'AcceptanceRejected',
    aggregateId: taskId,
    workspaceId,
    timestamp: new Date(),
    correlationId: correlationId || crypto.randomUUID(),
    causationId: causationId || null,
    payload: {
      taskId,
      taskTitle,
      rejectedById,
      rejectionReason,
    },
    metadata: {
      version: 1,
      userId: rejectedById,
    },
  };
}
