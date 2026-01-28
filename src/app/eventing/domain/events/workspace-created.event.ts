/**
 * WorkspaceCreatedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a new workspace is created.
 * Contains all information needed to track workspace creation in the event store.
 */

import { DomainEvent } from '@eventing/domain/events';

export interface WorkspaceCreatedPayload {
  readonly workspaceId: string;
  readonly name: string;
  readonly ownerId: string;
  readonly ownerType: 'user' | 'organization';
  readonly userId?: string;
}

export interface WorkspaceCreatedEvent extends DomainEvent<WorkspaceCreatedPayload> {
  readonly type: 'WorkspaceCreated';
}

/**
 * Create a WorkspaceCreatedEvent
 */
export function createWorkspaceCreatedEvent(
  workspaceId: string,
  name: string,
  ownerId: string,
  ownerType: 'user' | 'organization',
  userId?: string,
  correlationId?: string,
  causationId?: string | null
): WorkspaceCreatedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  const payload: WorkspaceCreatedPayload = {
    workspaceId,
    name,
    ownerId,
    ownerType,
    ...(userId !== undefined ? { userId } : {}),
  };
  
  return {
    eventId,
    type: 'WorkspaceCreated',
    aggregateId: workspaceId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}

