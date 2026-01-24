/**
 * WorkspaceSwitchedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when user switches between workspaces.
 * Contains all information needed to track workspace context changes.
 */

import { DomainEvent, EventMetadata } from '@domain/event/domain-event';

export interface WorkspaceSwitchedPayload {
  readonly previousWorkspaceId: string | null;
  readonly currentWorkspaceId: string;
}

export interface WorkspaceSwitchedEvent extends DomainEvent<WorkspaceSwitchedPayload> {
  readonly eventType: 'WorkspaceSwitched';
}

/**
 * Create a WorkspaceSwitchedEvent
 */
export function createWorkspaceSwitchedEvent(
  previousWorkspaceId: string | null,
  currentWorkspaceId: string,
  userId?: string,
  correlationId?: string,
  causationId?: string | null
): WorkspaceSwitchedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  const metadata: EventMetadata = userId
    ? { version: 1, userId }
    : { version: 1 };
  
  return {
    eventId,
    eventType: 'WorkspaceSwitched',
    aggregateId: currentWorkspaceId,
    workspaceId: currentWorkspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      previousWorkspaceId,
      currentWorkspaceId,
    },
    metadata,
  };
}
