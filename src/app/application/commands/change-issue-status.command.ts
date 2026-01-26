/**
 * Change Issue Status Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { IssueStatus } from '@domain/aggregates';

export interface ChangeIssueStatusCommand {
  issueId: string;
  newStatus: IssueStatus;
  changedByUserId: string;
}
