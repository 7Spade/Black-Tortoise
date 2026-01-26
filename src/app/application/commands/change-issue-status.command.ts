/**
 * Change Issue Status Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { IssueStatus } from '@domain/modules/issues/aggregates/issue.aggregate';

export interface ChangeIssueStatusCommand {
  issueId: string;
  newStatus: IssueStatus;
  changedByUserId: string;
}
