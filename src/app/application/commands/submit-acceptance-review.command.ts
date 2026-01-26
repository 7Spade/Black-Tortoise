/**
 * Submit Acceptance Review Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { AcceptanceStatus } from '@domain/modules/acceptance/aggregates/acceptance-check.aggregate';

export interface SubmitAcceptanceReviewCommand {
  id: string;
  taskId: string;
  workspaceId: string;
  status: AcceptanceStatus;
  notes: string;
  reviewedByUserId: string;
}
