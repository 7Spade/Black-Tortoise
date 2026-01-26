/**
 * Update Issue Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { IssuePriority, IssueType } from '@domain/aggregates';

export interface UpdateIssueCommand {
  issueId: string;
  title?: string;
  description?: string;
  type?: IssueType;
  priority?: IssuePriority;
  updatedByUserId: string;
}
