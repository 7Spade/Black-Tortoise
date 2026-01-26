/**
 * Update Settings Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { WorkspaceSettingsEntity } from '@domain/modules/settings/aggregates/workspace-settings.aggregate';

export interface UpdateSettingsCommand {
  workspaceId: string;
  settings: Partial<WorkspaceSettingsEntity>;
}
