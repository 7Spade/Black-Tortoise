/**
 * Permission Granted Event
 * 
 * Layer: Domain
 * Purpose: Permission has been granted to a role
 * Emitted by: Permissions module
 */

import { DomainEvent } from '@domain/shared/events/domain-event';

export interface PermissionGrantedPayload {
  readonly workspaceId: string;
  readonly roleId: string;
  readonly resource: string;
  readonly action: string;
  readonly grantedBy: string;
}

export interface PermissionGrantedEvent extends DomainEvent<PermissionGrantedPayload> {
  readonly type: 'PermissionGranted';
}

export function createPermissionGrantedEvent(
  roleId: string,
  workspaceId: string,
  resource: string,
  action: string,
  grantedBy: string,
  correlationId?: string,
  causationId?: string | null
): PermissionGrantedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    type: 'PermissionGranted',
    aggregateId: roleId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      roleId,
      resource,
      action,
      grantedBy,
    },
  };
}

