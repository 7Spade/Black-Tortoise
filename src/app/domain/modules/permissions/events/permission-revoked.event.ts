/**
 * Permission Revoked Event
 * 
 * Layer: Domain
 * Purpose: Permission has been revoked from a role
 * Emitted by: Permissions module
 */

import { DomainEvent } from '@domain/shared/events/domain-event';

export interface PermissionRevokedPayload {
  readonly workspaceId: string;
  readonly roleId: string;
  readonly resource: string;
  readonly action: string;
  readonly revokedBy: string;
}

export interface PermissionRevokedEvent extends DomainEvent<PermissionRevokedPayload> {
  readonly type: 'PermissionRevoked';
}

export function createPermissionRevokedEvent(
  roleId: string,
  workspaceId: string,
  resource: string,
  action: string,
  revokedBy: string,
  correlationId?: string,
  causationId?: string | null
): PermissionRevokedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    type: 'PermissionRevoked',
    aggregateId: roleId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      roleId,
      resource,
      action,
      revokedBy,
    },
  };
}

