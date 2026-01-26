/**
 * Invite Member Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { WorkspaceId } from '@domain/core/workspace';
import { MemberRole } from '@domain/modules/members/aggregates/member.aggregate';

export interface InviteMemberCommand {
  workspaceId: WorkspaceId;
  email: string;
  role: MemberRole;
  invitedByUserId: string;
}
