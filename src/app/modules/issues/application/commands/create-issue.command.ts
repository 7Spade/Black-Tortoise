/**
 * Create Issue Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { WorkspaceId } from '@domain/value-objects';
import { IssuePriority, IssueType } from '@issues/domain';

export interface CreateIssueCommand {
  id: string;
  workspaceId: WorkspaceId;
  title: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  reportedByUserId: string;
  assigneeId?: string;
}
