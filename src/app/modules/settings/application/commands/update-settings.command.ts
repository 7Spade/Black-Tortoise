/**
 * Update Settings Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

export interface ModuleConfigUpdate {
  moduleId: string;
  settings: Record<string, any>;
}

export interface NotificationConfigUpdate {
  emailEnabled: boolean;
  inAppEnabled: boolean;
}

export interface UpdateSettingsCommand {
  workspaceId: string;
  moduleConfigs?: ModuleConfigUpdate[];
  notificationConfig?: NotificationConfigUpdate;
}
