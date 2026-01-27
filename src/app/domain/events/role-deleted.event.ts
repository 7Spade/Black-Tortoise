/**
 * Role Deleted Event
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Published when a role is deleted
 */

import { DomainEvent } from '@domain/events';

export interface RoleDeletedPayload {
  readonly roleId: string;
  readonly workspaceId: string;
  readonly roleName: string;
}

export interface RoleDeletedEvent extends DomainEvent<RoleDeletedPayload> {
  readonly type: 'RoleDeleted';
}

/**
 * Create RoleDeleted event
 */
export function createRoleDeletedEvent(
  payload: RoleDeletedPayload,
  correlationId?: string
): RoleDeletedEvent {
  return {
    type: 'RoleDeleted',
    payload,
    timestamp: Date.now(),
    correlationId: correlationId ?? crypto.randomUUID(),
  };
}
