/**
 * Member Invited Event
 * 
 * Layer: Domain
 * Purpose: User has been invited to workspace
 * Emitted by: Members module
 */

import { DomainEvent } from '@domain/shared/events/domain-event';

export interface MemberInvitedPayload {
  readonly workspaceId: string;
  readonly inviteId: string;
  readonly email: string;
  readonly roleId: string;
  readonly invitedBy: string;
}

export interface MemberInvitedEvent extends DomainEvent<MemberInvitedPayload> {
  readonly type: 'MemberInvited';
}

export function createMemberInvitedEvent(
  inviteId: string,
  workspaceId: string,
  email: string,
  roleId: string,
  invitedBy: string,
  correlationId?: string,
  causationId?: string | null
): MemberInvitedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    type: 'MemberInvited',
    aggregateId: inviteId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      inviteId,
      email,
      roleId,
      invitedBy,
    },
  };
}

