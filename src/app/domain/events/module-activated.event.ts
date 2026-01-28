/**
 * ModuleActivatedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a module is activated in a workspace.
 */

import { DomainEvent } from '@domain/events';

export interface ModuleActivatedPayload {
  readonly moduleId: string;
  readonly workspaceId: string;
}

export interface ModuleActivatedEvent extends DomainEvent<ModuleActivatedPayload> {
  readonly type: 'ModuleActivated';
}

export interface CreateModuleActivatedEventParams {
  moduleId: string;
  workspaceId: string;
  correlationId?: string;
  causationId?: string | null;
}

export function createModuleActivatedEvent(
  params: CreateModuleActivatedEventParams
): ModuleActivatedEvent {
  const { moduleId, workspaceId, correlationId, causationId } = params;
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;

  return {
    eventId,
    type: 'ModuleActivated',
    aggregateId: moduleId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      moduleId,
      workspaceId,
    },
  };
}

