/**
 * MemberRemovedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a member is removed from the workspace.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface MemberRemovedPayload {
  readonly memberId: string;
  readonly removedById: string;
  readonly reason?: string;
}

export interface MemberRemovedEvent extends DomainEvent<MemberRemovedPayload> {
  readonly eventType: 'MemberRemoved';
}

export function createMemberRemovedEvent(
  memberId: string,
  workspaceId: string,
  removedById: string,
  reason?: string,
  correlationId?: string,
  causationId?: string | null
): MemberRemovedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    eventType: 'MemberRemoved',
    aggregateId: memberId,
    workspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      memberId,
      removedById,
      reason,
    },
    metadata: {
      version: 1,
      userId: removedById,
    },
  };
}
