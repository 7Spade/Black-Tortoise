/**
 * Workspace Settings View Model
 */
export interface WorkspaceSettingsViewModel {
    workspaceId: string;
    theme: 'light' | 'dark' | 'system';

    // Flattened or Simplified configuration for UI
    notifications: {
        email: boolean;
        inApp: boolean;
    };

    // Modules status derived from configs
    modules: Record<string, boolean>;
}
