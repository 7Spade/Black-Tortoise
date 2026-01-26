/**
 * Invite Member Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { WorkspaceId } from '@domain/value-objects';
import { MemberRole } from '@domain/aggregates';

export interface InviteMemberCommand {
  workspaceId: WorkspaceId;
  email: string;
  role: MemberRole;
  invitedByUserId: string;
}
