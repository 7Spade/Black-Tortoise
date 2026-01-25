/**
 * ModuleDeactivatedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a module is deactivated in a workspace.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface ModuleDeactivatedPayload {
  readonly moduleId: string;
  readonly workspaceId: string;
}

export interface ModuleDeactivatedEvent extends DomainEvent<ModuleDeactivatedPayload> {
  readonly type: 'ModuleDeactivated';
}

export function createModuleDeactivatedEvent(
  moduleId: string,
  workspaceId: string,
  correlationId?: string,
  causationId?: string | null
): ModuleDeactivatedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    type: 'ModuleDeactivated',
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
