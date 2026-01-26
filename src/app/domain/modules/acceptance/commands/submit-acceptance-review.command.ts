/**
 * Submit Acceptance Review Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

import { AcceptanceStatus } from '../aggregates/acceptance-check.aggregate';

export interface SubmitAcceptanceReviewCommand {
  id: string;
  taskId: string;
  workspaceId: string;
  status: AcceptanceStatus;
  notes: string;
  reviewedByUserId: string;
}
