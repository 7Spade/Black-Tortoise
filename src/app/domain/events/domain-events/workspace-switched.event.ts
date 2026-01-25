/**
 * WorkspaceSwitchedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when user switches between workspaces.
 * Contains all information needed to track workspace context changes.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface WorkspaceSwitchedPayload {
  readonly previousWorkspaceId: string | null;
  readonly currentWorkspaceId: string;
  readonly userId?: string;
}

export interface WorkspaceSwitchedEvent extends DomainEvent<WorkspaceSwitchedPayload> {
  readonly type: 'WorkspaceSwitched';
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
  
  const payload: WorkspaceSwitchedPayload = {
    previousWorkspaceId,
    currentWorkspaceId,
  };
  
  if (userId !== undefined) {
    (payload as { userId?: string }).userId = userId;
  }
  
  return {
    eventId,
    type: 'WorkspaceSwitched',
    aggregateId: currentWorkspaceId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}
