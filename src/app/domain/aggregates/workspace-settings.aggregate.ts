
export interface WorkspaceSettingsEntity {
  readonly workspaceId: string; // ID is workspaceId (Singular per workspace usually)
  readonly theme: 'light' | 'dark' | 'system';
  readonly language: string;
  readonly notificationsEnabled: boolean;
  readonly updatedAt: number;
}

export const DEFAULT_SETTINGS: WorkspaceSettingsEntity = {
  workspaceId: '',
  theme: 'system',
  language: 'en',
  notificationsEnabled: true,
  updatedAt: 0
};

export function updateSettings(
  current: WorkspaceSettingsEntity,
  updates: Partial<WorkspaceSettingsEntity>
): WorkspaceSettingsEntity {
  return {
    ...current,
    ...updates,
    updatedAt: Date.now()
  };
}
