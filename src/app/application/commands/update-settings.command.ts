/**
 * Update Settings Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { WorkspaceSettingsEntity } from '@domain/aggregates';

export interface UpdateSettingsCommand {
  workspaceId: string;
  settings: Partial<WorkspaceSettingsEntity>;
}
