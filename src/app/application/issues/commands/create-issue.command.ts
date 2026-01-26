/**
 * Create Issue Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { WorkspaceId } from '@domain/core/workspace';
import { IssuePriority, IssueType } from '@domain/modules/issues/aggregates/issue.aggregate';

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
