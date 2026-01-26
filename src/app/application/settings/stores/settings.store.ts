/**
 * Settings Store
 *
 * Layer: Application - Store
 * Purpose: Manages workspace settings state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+, NO RxJS
 *
 * Responsibilities:
 * - Track workspace configuration
 * - Manage user preferences
 * - Handle feature toggles
 *
 * Event Integration:
 * - Reacts to: WorkspaceSwitched
 * - Publishes: SettingsUpdated
 *
 * Clean Architecture Compliance:
 * - Single source of truth for settings
 * - All state updates via patchState
 * - No RxJS subscriptions
 * - Pure signal-based reactivity
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { TaskPriority } from '@domain/modules/tasks/aggregates/task.aggregate';

export interface WorkspaceSettings {
  readonly workingHours: {
    readonly start: string; // HH:MM
    readonly end: string; // HH:MM
  };
  readonly timezone: string;
  readonly defaultTaskPriority: TaskPriority;
  readonly enableNotifications: boolean;
  readonly enableAutoAssignment: boolean;
}

export interface UserPreferences {
  readonly theme: 'light' | 'dark' | 'system';
  readonly language: string;
  readonly compactMode: boolean;
  readonly showCompletedTasks: boolean;
}

export interface SettingsState {
  readonly workspaceSettings: WorkspaceSettings | null;
  readonly userPreferences: UserPreferences | null;
  readonly isSaving: boolean;
  readonly error: string | null;
}

const initialState: SettingsState = {
  workspaceSettings: null,
  userPreferences: null,
  isSaving: false,
  error: null,
};

/**
 * Settings Store
 *
 * Application-level store for settings management using NgRx Signals.
 */
export const SettingsStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Has workspace settings
     */
    hasWorkspaceSettings: computed(() => state.workspaceSettings() !== null),

    /**
     * Has user preferences
     */
    hasUserPreferences: computed(() => state.userPreferences() !== null),

    /**
     * Current theme
     */
    currentTheme: computed(() => state.userPreferences()?.theme || 'system'),

    /**
     * Notifications enabled
     */
    notificationsEnabled: computed(() => state.workspaceSettings()?.enableNotifications || false),
  })),

  withMethods((store) => ({
    /**
     * Set workspace settings
     */
    setWorkspaceSettings(settings: WorkspaceSettings): void {
      patchState(store, { workspaceSettings: settings });
    },

    /**
     * Update workspace settings
     */
    updateWorkspaceSettings(updates: Partial<WorkspaceSettings>): void {
      const current = store.workspaceSettings();
      if (!current) return;

      patchState(store, {
        workspaceSettings: { ...current, ...updates },
        isSaving: false,
      });
    },

    /**
     * Set user preferences
     */
    setUserPreferences(preferences: UserPreferences): void {
      patchState(store, { userPreferences: preferences });
    },

    /**
     * Update user preferences
     */
    updateUserPreferences(updates: Partial<UserPreferences>): void {
      const current = store.userPreferences();
      if (!current) return;

      patchState(store, {
        userPreferences: { ...current, ...updates },
        isSaving: false,
      });
    },

    /**
     * Clear all settings (workspace switch)
     */
    clearSettings(): void {
      patchState(store, {
        workspaceSettings: null,
        isSaving: false,
        error: null,
      });
    },

    /**
     * Set saving
     */
    setSaving(isSaving: boolean): void {
      patchState(store, { isSaving });
    },

    /**
     * Set error
     */
    setError(error: string | null): void {
      patchState(store, { error, isSaving: false });
    },
  }))
);



