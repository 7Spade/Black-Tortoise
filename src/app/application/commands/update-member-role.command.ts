/**
 * Update Member Role Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { MemberRole } from '@domain/modules/members/aggregates/member.aggregate';

export interface UpdateMemberRoleCommand {
  memberId: string;
  newRole: MemberRole;
  updatedByUserId: string;
}
