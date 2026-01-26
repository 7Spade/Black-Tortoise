
import { WorkspaceSettingsEntity } from '../aggregates/workspace-settings.aggregate';

export interface SettingsRepository {
  getSettings(workspaceId: string): Promise<WorkspaceSettingsEntity>;
  saveSettings(settings: WorkspaceSettingsEntity): Promise<void>;
}
