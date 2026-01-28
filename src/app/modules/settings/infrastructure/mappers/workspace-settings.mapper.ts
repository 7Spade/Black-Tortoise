import { WorkspaceSettingsAggregate, ModuleConfig, NotificationConfig } from '@settings/domain';
import { WorkspaceSettingsDto } from '@settings/infrastructure/models/workspace-settings.dto';
import { Timestamp } from '@angular/fire/firestore';

/**
 * Workspace Settings Mapper
 */
export class WorkspaceSettingsMapper {
    static toDomain(dto: WorkspaceSettingsDto): WorkspaceSettingsAggregate {
        // Reconstruct ModuleConfigs
        const moduleConfigs: ModuleConfig[] = [];
        if (dto.moduleConfigs) {
            Object.values(dto.moduleConfigs).forEach((conf: any) => {
                moduleConfigs.push(ModuleConfig.reconstitute(conf.moduleId, conf.settings));
            });
        }

        // Reconstruct NotificationConfig
        let notificationConfig: NotificationConfig | null = null;
        if (dto.notificationConfig) {
            notificationConfig = NotificationConfig.reconstitute(
                'notification-config', // Simple ID
                dto.notificationConfig.emailEnabled,
                dto.notificationConfig.inAppEnabled
            );
        }

        return WorkspaceSettingsAggregate.reconstitute(
            dto.workspaceId,
            dto.workspaceId,
            moduleConfigs,
            notificationConfig
        );
    }

    static toDto(domain: WorkspaceSettingsAggregate): WorkspaceSettingsDto {
        const moduleConfigsRecord: Record<string, any> = {};

        domain.allModuleConfigs.forEach(conf => {
            // Using 'any' access to private _settings for mapping purposes 
            moduleConfigsRecord[conf.moduleId] = {
                moduleId: conf.moduleId,
                settings: Object.fromEntries((conf as any)._settings)
            };
        });

        return {
            workspaceId: domain.workspaceId.value,
            theme: 'light',
            moduleConfigs: moduleConfigsRecord,
            notificationConfig: domain.notificationConfig ? {
                emailEnabled: domain.notificationConfig.emailEnabled,
                inAppEnabled: domain.notificationConfig.inAppEnabled
            } : { emailEnabled: true, inAppEnabled: true },
            updatedAt: Timestamp.now()
        };
    }
}
