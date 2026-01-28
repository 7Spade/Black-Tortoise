import { AggregateRoot } from '@domain/base/aggregate-root';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';
import { ModuleConfig } from '../entities/module-config.entity';
import { NotificationConfig } from '../entities/notification-config.entity';

// ID for settings aggregate, typically tied one-to-one with workspace
interface WorkspaceSettingsId {
    value: string;
}

/**
 * Workspace Settings Aggregate
 * 
 * Manages configuration for a workspace.
 */
export class WorkspaceSettingsAggregate extends AggregateRoot<WorkspaceSettingsId> {
    private _moduleConfigs: Map<string, ModuleConfig> = new Map();
    private _notificationConfig: NotificationConfig | null = null;

    private constructor(
        id: WorkspaceSettingsId,
        public readonly workspaceId: WorkspaceId
    ) {
        super(id);
    }

    public static create(id: string, workspaceId: WorkspaceId): WorkspaceSettingsAggregate {
        return new WorkspaceSettingsAggregate({ value: id }, workspaceId);
    }

    public setModuleConfig(config: ModuleConfig): void {
        this._moduleConfigs.set(config.moduleId, config);
    }

    public getModuleConfig(moduleId: string): ModuleConfig | undefined {
        return this._moduleConfigs.get(moduleId);
    }

    public updateNotificationConfig(config: NotificationConfig): void {
        this._notificationConfig = config;
    }
}
