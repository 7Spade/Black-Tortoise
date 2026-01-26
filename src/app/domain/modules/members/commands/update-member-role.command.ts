/**
 * Update Member Role Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

import { MemberRole } from '../aggregates/member.aggregate';

export interface UpdateMemberRoleCommand {
  memberId: string;
  newRole: MemberRole;
  updatedByUserId: string;
}
