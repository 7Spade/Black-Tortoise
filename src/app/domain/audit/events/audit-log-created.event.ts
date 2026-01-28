
import { DomainEvent } from '../../events/domain-event';
import { EventType } from '../../events/event-type';

export interface AuditLogCreatedPayload {
  readonly auditLogId: string;
  readonly action: string;
}

export interface AuditLogCreatedEvent extends DomainEvent<AuditLogCreatedPayload> {
  readonly type: typeof EventType.AUDIT_LOG_CREATED;
}

export interface CreateAuditLogCreatedEventParams {
  eventId?: string;
  aggregateId: string;
  workspaceId: string;
  payload: AuditLogCreatedPayload;
  causationId?: string | null;
  correlationId: string;
}

export function createAuditLogCreatedEvent(
  params: CreateAuditLogCreatedEventParams
): AuditLogCreatedEvent {
  const { eventId, aggregateId, correlationId, causationId, payload } = params;

  return {
    eventId: eventId ?? crypto.randomUUID(),
    type: EventType.AUDIT_LOG_CREATED,
    aggregateId,
    workspaceId: params.workspaceId,
    correlationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload
  };
}
