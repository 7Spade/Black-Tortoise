/**
 * MemberAddedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a member is added to the workspace.
 */

import { DomainEvent } from '@domain/event/domain-event';

export interface MemberAddedPayload {
  readonly memberId: string;
  readonly email: string;
  readonly displayName: string;
  readonly roleIds: string[];
  readonly addedById: string;
}

export interface MemberAddedEvent extends DomainEvent<MemberAddedPayload> {
  readonly eventType: 'MemberAdded';
}

export function createMemberAddedEvent(
  memberId: string,
  workspaceId: string,
  email: string,
  displayName: string,
  roleIds: string[],
  addedById: string,
  correlationId?: string,
  causationId?: string | null
): MemberAddedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    eventType: 'MemberAdded',
    aggregateId: memberId,
    workspaceId,
    timestamp: new Date(),
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    payload: {
      memberId,
      email,
      displayName,
      roleIds,
      addedById,
    },
    metadata: {
      version: 1,
      userId: addedById,
    },
  };
}
