/**
 * UpdateSettingsHandler
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { UpdateSettingsCommand } from '@settings/application/commands/update-settings.command';
import { SettingsRepository } from '@domain/repositories/settings.repository';
import { WorkspaceSettingsAggregate } from '@settings/domain/aggregates/workspace-settings.aggregate';
import { ModuleConfig } from '@settings/domain/entities/module-config.entity';
import { NotificationConfig } from '@settings/domain/entities/notification-config.entity';
import { SettingKey } from '@settings/domain/value-objects/setting-key.vo';
import { SettingValue } from '@settings/domain/value-objects/setting-value.vo';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';

@Injectable({ providedIn: 'root' })
export class UpdateSettingsHandler {
  private repo = inject(SettingsRepository);

  async execute(command: UpdateSettingsCommand): Promise<void> {

    let aggregate = await this.repo.getSettings(command.workspaceId);

    if (!aggregate) {
      aggregate = WorkspaceSettingsAggregate.create(command.workspaceId, new WorkspaceId(command.workspaceId));
    }

    // 2. Update Module Configs
    if (command.moduleConfigs) {
      command.moduleConfigs.forEach(update => {
        let config = aggregate!.getModuleConfig(update.moduleId);
        if (!config) {
          config = ModuleConfig.create(update.moduleId);
        }

        Object.entries(update.settings).forEach(([k, v]) => {
          config!.setSetting(new SettingKey(k), new SettingValue(v));
        });

        aggregate!.setModuleConfig(config);
      });
    }

    // 3. Update Notification Config
    if (command.notificationConfig) {
      // TODO: FIX BROKEN CODE
      // const notif = NotificationConfig.reconstitute(
      //   'notification-config',
      // }
    }
  }
}
