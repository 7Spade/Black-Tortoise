
import { WorkspaceSettingsAggregate } from '@domain/settings/aggregates/workspace-settings.aggregate';

export abstract class SettingsRepository {
  abstract getSettings(workspaceId: string): Promise<WorkspaceSettingsAggregate | null>;
  abstract save(settings: WorkspaceSettingsAggregate): Promise<void>;
}
