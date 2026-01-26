/**
 * Submit QC Check Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

import { QCStatus } from '../aggregates/quality-control.aggregate';

export interface SubmitQCCheckCommand {
  id: string;
  taskId: string;
  workspaceId: string;
  status: QCStatus;
  artifacts: string[];
  comments: string;
  checkedByUserId: string;
}
