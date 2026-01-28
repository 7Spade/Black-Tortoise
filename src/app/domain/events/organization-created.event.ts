import { DomainEvent } from './domain-event';
import { EventType } from './event-type';

/**
 * Organization Created Event Payload
 */
export interface OrganizationCreatedPayload {
  organizationId: string;
  organizationName: string;
  ownerId: string;
}

/**
 * Organization Created Event
 * 
 * Layer: Domain
 * Purpose: Emitted when a new organization is created
 */
export interface OrganizationCreatedEvent extends DomainEvent<OrganizationCreatedPayload> {
  type: typeof EventType.ORGANIZATION_CREATED;
}

export interface CreateOrganizationCreatedEventParams {
  organizationId: string;
  organizationName: string;
  ownerId: string;
  correlationId?: string;
  causationId?: string | null;
}

export function createOrganizationCreatedEvent(
  params: CreateOrganizationCreatedEventParams
): OrganizationCreatedEvent {
  const { organizationId, organizationName, ownerId, correlationId, causationId } = params;
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;

  return {
    eventId,
    type: EventType.ORGANIZATION_CREATED,
    aggregateId: organizationId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      organizationId,
      organizationName,
      ownerId
    }
  };
}
