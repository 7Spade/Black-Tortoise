/**
 * Submit QC Check Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { QCStatus } from '@domain/aggregates';

export interface SubmitQCCheckCommand {
  id: string;
  taskId: string;
  workspaceId: string;
  status: QCStatus;
  artifacts: string[];
  comments: string;
  checkedByUserId: string;
}
