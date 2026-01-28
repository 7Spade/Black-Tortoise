
import { WorkspaceSettingsAggregate } from '../aggregates/workspace-settings.aggregate';
import { SettingsId } from '../value-objects/settings-id.vo';
import { InjectionToken } from '@angular/core';

export interface WorkspaceSettingsRepository {
    findByWorkspace(workspaceId: string): Promise<WorkspaceSettingsAggregate | null>;
    save(settings: WorkspaceSettingsAggregate): Promise<void>;
}

export const WORKSPACE_SETTINGS_REPOSITORY = new InjectionToken<WorkspaceSettingsRepository>('WORKSPACE_SETTINGS_REPOSITORY');
