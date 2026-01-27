/**
 * Role Created Event
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Published when a new role is created
 */

import { DomainEvent } from '@domain/events';

export interface RoleCreatedPayload {
  readonly roleId: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly permissions: ReadonlyArray<string>;
}

export interface RoleCreatedEvent extends DomainEvent<RoleCreatedPayload> {
  readonly type: 'RoleCreated';
}

/**
 * Create RoleCreated event
 */
export function createRoleCreatedEvent(
  payload: RoleCreatedPayload,
  correlationId?: string
): RoleCreatedEvent {
  return {
    type: 'RoleCreated',
    payload,
    timestamp: Date.now(),
    correlationId: correlationId ?? crypto.randomUUID(),
  };
}
