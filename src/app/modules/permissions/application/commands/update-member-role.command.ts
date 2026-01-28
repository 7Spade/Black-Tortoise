/**
 * Update Member Role Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { MemberRole } from '@permissions/domain';

export interface UpdateMemberRoleCommand {
  memberId: string;
  newRole: MemberRole;
  updatedByUserId: string;
}
