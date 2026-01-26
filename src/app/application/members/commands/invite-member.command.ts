/**
 * Invite Member Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { MemberRole } from '@domain/modules/members/aggregates/member.aggregate';
import { WorkspaceId } from '@domain/modules/members/value-objects/workspace-id.vo';

export interface InviteMemberCommand {
  workspaceId: WorkspaceId;
  email: string;
  role: MemberRole;
  invitedByUserId: string;
}
