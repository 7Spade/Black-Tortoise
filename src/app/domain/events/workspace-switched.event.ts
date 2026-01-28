/**
 * WorkspaceSwitchedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when user switches between workspaces.
 * Contains all information needed to track workspace context changes.
 */

import { DomainEvent } from '@domain/events';

export interface WorkspaceSwitchedPayload {
  readonly previousWorkspaceId: string | null;
  readonly currentWorkspaceId: string;
  readonly userId?: string;
}

export interface WorkspaceSwitchedEvent extends DomainEvent<WorkspaceSwitchedPayload> {
  readonly type: 'WorkspaceSwitched';
}

export interface CreateWorkspaceSwitchedEventParams {
  previousWorkspaceId: string | null;
  currentWorkspaceId: string;
  userId?: string;
  correlationId?: string;
  causationId?: string | null;
}

/**
 * Create a WorkspaceSwitchedEvent
 */
export function createWorkspaceSwitchedEvent(
  params: CreateWorkspaceSwitchedEventParams
): WorkspaceSwitchedEvent {
  const { previousWorkspaceId, currentWorkspaceId, userId, correlationId, causationId } = params;
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;

  const payload: WorkspaceSwitchedPayload = {
    previousWorkspaceId,
    currentWorkspaceId,
    ...(userId !== undefined ? { userId } : {}),
  };

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

