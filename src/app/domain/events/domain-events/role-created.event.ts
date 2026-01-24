/**
 * RoleCreatedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a new role is created.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface RoleCreatedPayload {
  readonly roleId: string;
  readonly roleName: string;
  readonly description?: string;
  readonly createdById: string;
}

export interface RoleCreatedEvent extends DomainEvent<RoleCreatedPayload> {
  readonly eventType: 'RoleCreated';
}

export function createRoleCreatedEvent(
  roleId: string,
  workspaceId: string,
  roleName: string,
  createdById: string,
  description?: string,
  correlationId?: string,
  causationId?: string | null
): RoleCreatedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    eventType: 'RoleCreated',
    aggregateId: roleId,
    workspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      roleId,
      roleName,
      description,
      createdById,
    },
    metadata: {
      version: 1,
      userId: createdById,
    },
  };
}
