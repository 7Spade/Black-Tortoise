/**
 * Acceptance Rejected Event
 * 
 * Layer: Domain
 * Purpose: Task has been rejected in acceptance phase
 * Emitted by: Acceptance module
 */

import { DomainEvent } from '../../events/domain-event';

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

export interface AcceptanceRejectedParams {
  taskId: string;
  workspaceId: string;
  taskTitle: string;
  rejectedById: string;
  rejectionReason: string;
  correlationId?: string;
  causationId?: string | null;
}

export function createAcceptanceRejectedEvent(params: AcceptanceRejectedParams): AcceptanceRejectedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = params.correlationId ?? eventId;

  return {
    eventId,
    type: 'AcceptanceRejected',
    aggregateId: params.taskId,
    correlationId: newCorrelationId,
    causationId: params.causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId: params.workspaceId,
      taskId: params.taskId,
      taskTitle: params.taskTitle,
      rejectedById: params.rejectedById,
      rejectionReason: params.rejectionReason,
    },
  };
}

