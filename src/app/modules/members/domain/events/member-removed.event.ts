/**
 * Member Removed Event
 * 
 * Layer: Domain
 * Purpose: User has been removed from workspace
 * Emitted by: Members module
 */

import { DomainEvent } from '@members/events/domain-event';

export interface MemberRemovedPayload {
  readonly workspaceId: string;
  readonly userId: string;
  readonly removedBy: string;
  readonly reason?: string;
}

export interface MemberRemovedEvent extends DomainEvent<MemberRemovedPayload> {
  readonly type: 'MemberRemoved';
}

export interface CreateMemberRemovedEventParams {
  userId: string;
  workspaceId: string;
  removedBy: string;
  reason?: string;
  correlationId?: string;
  causationId?: string | null;
}

export function createMemberRemovedEvent(params: CreateMemberRemovedEventParams): MemberRemovedEvent {
  const { userId, workspaceId, removedBy, reason, correlationId, causationId } = params;
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;

  const payload: MemberRemovedPayload = {
    workspaceId,
    userId,
    removedBy,
    ...(reason !== undefined ? { reason } : {}),
  };

  return {
    eventId,
    type: 'MemberRemoved',
    aggregateId: userId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}

