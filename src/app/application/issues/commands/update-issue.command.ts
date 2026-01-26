/**
 * Update Issue Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { IssuePriority, IssueType } from '@domain/modules/issues/aggregates/issue.aggregate';

export interface UpdateIssueCommand {
  issueId: string;
  title?: string;
  description?: string;
  type?: IssueType;
  priority?: IssuePriority;
  updatedByUserId: string;
}
