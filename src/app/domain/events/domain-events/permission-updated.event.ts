/**
 * PermissionUpdatedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when permissions are updated for a role.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface PermissionUpdatedPayload {
  readonly roleId: string;
  readonly roleName: string;
  readonly resource: string;
  readonly permissions: string[];
  readonly updatedById: string;
}

export interface PermissionUpdatedEvent extends DomainEvent<PermissionUpdatedPayload> {
  readonly eventType: 'PermissionUpdated';
}

export function createPermissionUpdatedEvent(
  roleId: string,
  workspaceId: string,
  roleName: string,
  resource: string,
  permissions: string[],
  updatedById: string,
  correlationId?: string,
  causationId?: string | null
): PermissionUpdatedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    eventType: 'PermissionUpdated',
    aggregateId: roleId,
    workspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      roleId,
      roleName,
      resource,
      permissions,
      updatedById,
    },
    metadata: {
      version: 1,
      userId: updatedById,
    },
  };
}
