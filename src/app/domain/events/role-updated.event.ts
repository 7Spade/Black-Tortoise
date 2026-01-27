/**
 * Role Updated Event
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Published when role details or permissions are updated
 */

import { DomainEvent } from '@domain/events';

export interface RoleUpdatedPayload {
  readonly roleId: string;
  readonly workspaceId: string;
  readonly changes: {
    readonly name?: string;
    readonly permissions?: ReadonlyArray<string>;
    readonly description?: string;
    readonly color?: string;
  };
}

export interface RoleUpdatedEvent extends DomainEvent<RoleUpdatedPayload> {
  readonly type: 'RoleUpdated';
}

/**
 * Create RoleUpdated event
 */
export function createRoleUpdatedEvent(
  payload: RoleUpdatedPayload,
  correlationId?: string
): RoleUpdatedEvent {
  return {
    type: 'RoleUpdated',
    payload,
    timestamp: Date.now(),
    correlationId: correlationId ?? crypto.randomUUID(),
  };
}
