/**
 * Change Issue Status Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { IssueStatus } from '@issues/domain';

export interface ChangeIssueStatusCommand {
  issueId: string;
  newStatus: IssueStatus;
  changedByUserId: string;
}
