/**
 * Invite Member Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

import { MemberRole } from '../aggregates/member.aggregate';
import { WorkspaceId } from '../value-objects/workspace-id.vo';

export interface InviteMemberCommand {
  workspaceId: WorkspaceId;
  email: string;
  role: MemberRole;
  invitedByUserId: string;
}
