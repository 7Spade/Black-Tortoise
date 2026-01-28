/**
 * Update Settings Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { WorkspaceSettingsEntity } from '@workspace/domain';

export interface UpdateSettingsCommand {
  workspaceId: string;
  settings: Partial<WorkspaceSettingsEntity>;
}

