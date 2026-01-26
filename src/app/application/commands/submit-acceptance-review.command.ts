/**
 * Submit Acceptance Review Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { AcceptanceStatus } from '@domain/aggregates';

export interface SubmitAcceptanceReviewCommand {
  id: string;
  taskId: string;
  workspaceId: string;
  status: AcceptanceStatus;
  notes: string;
  reviewedByUserId: string;
}
