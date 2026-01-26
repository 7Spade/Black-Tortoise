/**
 * Update Settings Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

import { WorkspaceSettingsEntity } from '../aggregates/workspace-settings.aggregate';

export interface UpdateSettingsCommand {
  workspaceId: string;
  settings: Partial<WorkspaceSettingsEntity>;
}
