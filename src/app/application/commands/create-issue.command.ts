/**
 * Create Issue Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { WorkspaceId } from '@domain/value-objects';
import { IssuePriority, IssueType } from '@domain/aggregates';

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
