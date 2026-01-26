
import { DomainEvent } from '@domain/shared/events';
import { EventMetadata } from '@domain/shared/events/event-metadata';
import { EventType } from '@domain/shared/events/event-type';

export interface AuditLogCreatedPayload {
  readonly auditLogId: string;
  readonly action: string;
}

export class AuditLogCreatedEvent implements DomainEvent<AuditLogCreatedPayload> {
  readonly eventType = EventType.AUDIT_LOG_CREATED; // Ensure this type exists or use generic
  readonly timestamp = Date.now();

  constructor(
    readonly eventId: string,
    readonly aggregateId: string,
    readonly workspaceId: string,
    readonly payload: AuditLogCreatedPayload,
    readonly causalityId: string, // Audit usually follows another event
    readonly correlationId: string,
    readonly metadata: EventMetadata = {} as any
  ) {}
}
