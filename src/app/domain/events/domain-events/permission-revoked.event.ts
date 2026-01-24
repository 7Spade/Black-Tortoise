/**
 * Permission Revoked Event
 * 
 * Layer: Domain
 * Purpose: Permission has been revoked from a role
 * Emitted by: Permissions module
 */

import { DomainEvent, EventMetadata } from '@domain/event/domain-event';

export interface PermissionRevokedPayload {
  readonly roleId: string;
  readonly resource: string;
  readonly action: string;
  readonly revokedBy: string;
}

export interface PermissionRevokedEvent extends DomainEvent<PermissionRevokedPayload> {
  readonly eventType: 'PermissionRevoked';
}

export function createPermissionRevokedEvent(
  roleId: string,
  workspaceId: string,
  resource: string,
  action: string,
  revokedBy: string,
  correlationId?: string
): PermissionRevokedEvent {
  return {
    eventId: crypto.randomUUID(),
    eventType: 'PermissionRevoked',
    aggregateId: roleId,
    workspaceId,
    timestamp: new Date(),
    correlationId: correlationId || crypto.randomUUID(),
    causationId: null,
    payload: {
      roleId,
      resource,
      action,
      revokedBy,
    },
    metadata: {
      version: 1,
      userId: revokedBy,
    },
  };
}
