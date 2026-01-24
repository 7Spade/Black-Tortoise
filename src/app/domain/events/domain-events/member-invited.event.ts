/**
 * Member Invited Event
 * 
 * Layer: Domain
 * Purpose: User has been invited to workspace
 * Emitted by: Members module
 */

import { DomainEvent, EventMetadata } from '@domain/event/domain-event';

export interface MemberInvitedPayload {
  readonly inviteId: string;
  readonly email: string;
  readonly roleId: string;
  readonly invitedBy: string;
}

export interface MemberInvitedEvent extends DomainEvent<MemberInvitedPayload> {
  readonly eventType: 'MemberInvited';
}

export function createMemberInvitedEvent(
  inviteId: string,
  workspaceId: string,
  email: string,
  roleId: string,
  invitedBy: string,
  correlationId?: string
): MemberInvitedEvent {
  return {
    eventId: crypto.randomUUID(),
    eventType: 'MemberInvited',
    aggregateId: inviteId,
    workspaceId,
    timestamp: new Date(),
    correlationId: correlationId || crypto.randomUUID(),
    causationId: null,
    payload: {
      inviteId,
      email,
      roleId,
      invitedBy,
    },
    metadata: {
      version: 1,
      userId: invitedBy,
    },
  };
}
