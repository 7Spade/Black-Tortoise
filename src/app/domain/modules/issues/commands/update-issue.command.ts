/**
 * Update Issue Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

import { IssuePriority, IssueType } from '../aggregates/issue.aggregate';

export interface UpdateIssueCommand {
  issueId: string;
  title?: string;
  description?: string;
  type?: IssueType;
  priority?: IssuePriority;
  updatedByUserId: string;
}
