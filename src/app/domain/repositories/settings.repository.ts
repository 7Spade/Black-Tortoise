
import { WorkspaceSettingsEntity } from '../aggregates';

export interface SettingsRepository {
  getSettings(workspaceId: string): Promise<WorkspaceSettingsEntity>;
  saveSettings(settings: WorkspaceSettingsEntity): Promise<void>;
}
