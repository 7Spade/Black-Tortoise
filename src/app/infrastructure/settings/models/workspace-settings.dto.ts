import { Timestamp } from '@angular/fire/firestore';

/**
 * Workspace Settings DTO
 * 
 * Infrastructure representation.
 * Maps the complex ModuleConfig Map to a JSON object for Firestore.
 */
export interface WorkspaceSettingsDto {
    workspaceId: string;
    theme: 'light' | 'dark' | 'system';

    // Serialized Map<string, ModuleConfig> -> Record<string, any>
    moduleConfigs: Record<string, {
        moduleId: string;
        settings: Record<string, any>;
    }>;

    // Nested Notification Config
    notificationConfig: {
        emailEnabled: boolean;
        inAppEnabled: boolean;
    };

    updatedAt: Timestamp;
}
