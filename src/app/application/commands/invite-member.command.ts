/**
 * Invite Member Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { WorkspaceId } from '@workspace/domain';
import { MemberRole } from '@domain/aggregates';

export interface InviteMemberCommand {
  workspaceId: WorkspaceId;
  email: string;
  role: MemberRole;
  invitedByUserId: string;
}

