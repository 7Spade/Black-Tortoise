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

export function createOrganizationCreatedEvent(
  organizationId: string,
  organizationName: string,
  ownerId: string
): OrganizationCreatedEvent {
  return {
    eventId: crypto.randomUUID(),
    type: EventType.ORGANIZATION_CREATED,
    aggregateId: organizationId,
    // For root events, correlationId can be new if not provided. 
    // Ideally it should be passed in, but for now generating new one conforms to types.
    correlationId: crypto.randomUUID(),
    causationId: null,
    timestamp: Date.now(),
    payload: {
      organizationId,
      organizationName,
      ownerId
    }
  };
}
