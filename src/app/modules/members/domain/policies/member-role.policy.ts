/**
 * Member Role Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 * 
 * Encapsulates business rules for member role management and status transitions.
 */

import { MemberAggregate } from '@members/domain/aggregates/member.aggregate';
import { MemberRole, MemberRoleType } from '@members/domain/value-objects/member-role.vo';
import { MemberStatusEnum } from '@members/domain/value-objects/member-status.vo';

/**
 * Check if the member can be promoted to the target role
 */
export function canChangeMemberRole(
  member: MemberAggregate,
  targetRole: MemberRole
): { allowed: boolean; reason?: string } {
  if (member.status.value !== MemberStatusEnum.ACTIVE) {
    return { allowed: false, reason: 'Only active members can have their role changed.' };
  }

  if (member.role.value === MemberRoleType.OWNER) {
    return { allowed: false, reason: 'Cannot change the role of the Workspace Owner directly. Use transfer ownership.' };
  }

  if (targetRole.value === MemberRoleType.OWNER) {
    return { allowed: false, reason: 'Cannot promote a member to Owner directly. Use transfer ownership.' };
  }

  return { allowed: true };
}

/**
 * Check if the member can be suspended
 */
export function canSuspendMember(member: MemberAggregate): { allowed: boolean; reason?: string } {
  if (member.role.value === MemberRoleType.OWNER) {
    return { allowed: false, reason: 'Cannot suspend the Workspace Owner.' };
  }

  if (member.status.value === MemberStatusEnum.SUSPENDED) {
    return { allowed: false, reason: 'Member is already suspended.' };
  }

  if (member.status.value === MemberStatusEnum.REMOVED) {
    return { allowed: false, reason: 'Cannot suspend a removed member.' };
  }

  return { allowed: true };
}

/**
 * Check if the member can be activated (e.g. from pending or suspended)
 */
export function canActivateMember(member: MemberAggregate): { allowed: boolean; reason?: string } {
  if (member.status.value === MemberStatusEnum.ACTIVE) {
    return { allowed: false, reason: 'Member is already active.' };
  }

  if (member.status.value === MemberStatusEnum.REMOVED) {
    return { allowed: false, reason: 'Cannot activate a removed member. Needs re-invitation.' };
  }

  return { allowed: true };
}

/**
 * Check if the member can be invited
 */
export function validateInvitation(
  email: string,
  role: MemberRole
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!email || !email.includes('@')) {
    errors.push('Invalid email address.');
  }

  if (role.value === MemberRoleType.OWNER) {
    errors.push('Cannot invite a user as Owner.');
  }

  return { valid: errors.length === 0, errors };
}
