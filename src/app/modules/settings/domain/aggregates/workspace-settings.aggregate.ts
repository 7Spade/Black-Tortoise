import { AggregateRoot } from '@domain/base/aggregate-root';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';
import { ModuleConfig } from '../entities/module-config.entity';
import { NotificationConfig } from '../entities/notification-config.entity';
import { SettingsId } from '../value-objects/settings-id.vo';

/**
 * Workspace Settings Aggregate
 * 
 * Manages configuration for a workspace.
 */
export class WorkspaceSettingsAggregate extends AggregateRoot<SettingsId> {
    private _moduleConfigs: Map<string, ModuleConfig> = new Map();
    private _notificationConfig: NotificationConfig | null = null;

    private constructor(
        id: SettingsId,
        public readonly workspaceId: WorkspaceId
    ) {
        super(id);
    }

    public static create(id: string, workspaceId: WorkspaceId): WorkspaceSettingsAggregate {
        return new WorkspaceSettingsAggregate({ value: id }, workspaceId);
    }

    public static reconstitute(
        id: string,
        workspaceId: string,
        moduleConfigs: ModuleConfig[],
        notificationConfig: NotificationConfig | null
    ): WorkspaceSettingsAggregate {
        const aggregate = new WorkspaceSettingsAggregate(
            { value: id },
            new WorkspaceId(workspaceId)
        );
        moduleConfigs.forEach(conf => aggregate.setModuleConfig(conf));
        if (notificationConfig) {
            aggregate.updateNotificationConfig(notificationConfig);
        }
        return aggregate;
    }

    public setModuleConfig(config: ModuleConfig): void {
        this._moduleConfigs.set(config.moduleId, config);
    }

    public getModuleConfig(moduleId: string): ModuleConfig | undefined {
        return this._moduleConfigs.get(moduleId);
    }

    public get allModuleConfigs(): ModuleConfig[] {
        return Array.from(this._moduleConfigs.values());
    }

    public get notificationConfig(): NotificationConfig | null {
        return this._notificationConfig;
    }

    public updateNotificationConfig(config: NotificationConfig): void {
        this._notificationConfig = config;
    }
}
