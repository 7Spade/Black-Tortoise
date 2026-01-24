/**
 * Member Removed Event
 * 
 * Layer: Domain
 * Purpose: User has been removed from workspace
 * Emitted by: Members module
 */

import { DomainEvent, EventMetadata } from '@domain/event/domain-event';

export interface MemberRemovedPayload {
  readonly userId: string;
  readonly removedBy: string;
  readonly reason?: string;
}

export interface MemberRemovedEvent extends DomainEvent<MemberRemovedPayload> {
  readonly eventType: 'MemberRemoved';
}

export function createMemberRemovedEvent(
  userId: string,
  workspaceId: string,
  removedBy: string,
  reason?: string,
  correlationId?: string
): MemberRemovedEvent {
  return {
    eventId: crypto.randomUUID(),
    eventType: 'MemberRemoved',
    aggregateId: userId,
    workspaceId,
    timestamp: new Date(),
    correlationId: correlationId || crypto.randomUUID(),
    causationId: null,
    payload: {
      userId,
      removedBy,
      reason,
    },
    metadata: {
      version: 1,
      userId: removedBy,
    },
  };
}
