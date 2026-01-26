/**
 * Member Aggregate Root
 * 
 * Layer: Domain
 * DDD Pattern: Aggregate Root
 * 
 * The Member aggregate represents workspace membership with roles and permissions.
 * It enforces business rules around member invitation, activation, and role management.
 */

import { WorkspaceId } from '../value-objects/workspace-id.vo';

export type MemberRole = 'owner' | 'admin' | 'member' | 'guest';
export type MemberStatus = 'pending' | 'active' | 'suspended' | 'removed';

export interface MemberAggregate {
  readonly id: string;
  readonly workspaceId: WorkspaceId;
  readonly userId: string;
  readonly role: MemberRole;
  readonly status: MemberStatus;
  readonly invitedBy: string;
  readonly invitedAt: Date;
  readonly joinedAt?: Date;
  readonly updatedAt: Date;
  readonly version: number;
}

/**
 * Create a new Member aggregate (invitation)
 */
export function inviteMember(
  id: string,
  workspaceId: WorkspaceId,
  userId: string,
  role: MemberRole,
  invitedBy: string
): MemberAggregate {
  if (!userId || userId.trim().length === 0) {
    throw new Error('User ID cannot be empty');
  }

  if (!invitedBy || invitedBy.trim().length === 0) {
    throw new Error('Inviter ID cannot be empty');
  }

  if (role === 'owner') {
    throw new Error('Cannot invite a member as owner. Transfer ownership instead.');
  }

  return {
    id,
    workspaceId,
    userId,
    role,
    status: 'pending',
    invitedBy,
    invitedAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  };
}

/**
 * Accept invitation and activate member
 */
export function activateMember(member: MemberAggregate): MemberAggregate {
  if (member.status !== 'pending') {
    throw new Error(`Cannot activate member in ${member.status} status`);
  }

  return {
    ...member,
    status: 'active',
    joinedAt: new Date(),
    updatedAt: new Date(),
    version: member.version + 1,
  };
}

/**
 * Change member role
 */
export function changeMemberRole(
  member: MemberAggregate,
  newRole: MemberRole
): MemberAggregate {
  if (member.status !== 'active') {
    throw new Error('Can only change role for active members');
  }

  if (member.role === 'owner' && newRole !== 'owner') {
    throw new Error('Cannot change owner role. Transfer ownership instead.');
  }

  if (newRole === 'owner') {
    throw new Error('Cannot promote to owner. Use transfer ownership instead.');
  }

  return {
    ...member,
    role: newRole,
    updatedAt: new Date(),
    version: member.version + 1,
  };
}

/**
 * Suspend member
 */
export function suspendMember(member: MemberAggregate): MemberAggregate {
  if (member.status !== 'active') {
    throw new Error('Can only suspend active members');
  }

  if (member.role === 'owner') {
    throw new Error('Cannot suspend workspace owner');
  }

  return {
    ...member,
    status: 'suspended',
    updatedAt: new Date(),
    version: member.version + 1,
  };
}

/**
 * Reactivate suspended member
 */
export function reactivateMember(member: MemberAggregate): MemberAggregate {
  if (member.status !== 'suspended') {
    throw new Error('Can only reactivate suspended members');
  }

  return {
    ...member,
    status: 'active',
    updatedAt: new Date(),
    version: member.version + 1,
  };
}

/**
 * Remove member from workspace
 */
export function removeMember(member: MemberAggregate): MemberAggregate {
  if (member.status === 'removed') {
    throw new Error('Member is already removed');
  }

  if (member.role === 'owner') {
    throw new Error('Cannot remove workspace owner. Transfer ownership first.');
  }

  return {
    ...member,
    status: 'removed',
    updatedAt: new Date(),
    version: member.version + 1,
  };
}

/**
 * Promote member to owner (transfer ownership)
 */
export function promoteToOwner(member: MemberAggregate): MemberAggregate {
  if (member.status !== 'active') {
    throw new Error('Can only promote active members to owner');
  }

  if (member.role === 'owner') {
    throw new Error('Member is already the owner');
  }

  return {
    ...member,
    role: 'owner',
    updatedAt: new Date(),
    version: member.version + 1,
  };
}

/**
 * Demote owner to admin (after ownership transfer)
 */
export function demoteFromOwner(member: MemberAggregate): MemberAggregate {
  if (member.role !== 'owner') {
    throw new Error('Member is not the owner');
  }

  return {
    ...member,
    role: 'admin',
    updatedAt: new Date(),
    version: member.version + 1,
  };
}
