/**
 * Permission Granted Event
 * 
 * Layer: Domain
 * Purpose: Permission has been granted to a role
 * Emitted by: Permissions module
 */

import { DomainEvent, EventMetadata } from '@domain/event/domain-event';

export interface PermissionGrantedPayload {
  readonly roleId: string;
  readonly resource: string;
  readonly action: string;
  readonly grantedBy: string;
}

export interface PermissionGrantedEvent extends DomainEvent<PermissionGrantedPayload> {
  readonly eventType: 'PermissionGranted';
}

export function createPermissionGrantedEvent(
  roleId: string,
  workspaceId: string,
  resource: string,
  action: string,
  grantedBy: string,
  correlationId?: string
): PermissionGrantedEvent {
  return {
    eventId: crypto.randomUUID(),
    eventType: 'PermissionGranted',
    aggregateId: roleId,
    workspaceId,
    timestamp: new Date(),
    correlationId: correlationId || crypto.randomUUID(),
    causationId: null,
    payload: {
      roleId,
      resource,
      action,
      grantedBy,
    },
    metadata: {
      version: 1,
      userId: grantedBy,
    },
  };
}
