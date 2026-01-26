/**
 * Change Issue Status Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

import { IssueStatus } from '../aggregates/issue.aggregate';

export interface ChangeIssueStatusCommand {
  issueId: string;
  newStatus: IssueStatus;
  changedByUserId: string;
}
