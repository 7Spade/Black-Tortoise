/**
 * Settings Module - Workspace Configuration
 * Layer: Presentation
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { SettingsStore } from '@application/settings/stores/settings.store';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';

@Component({
  selector: 'app-settings-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="settings-module">
      <div class="module-header">
        <h2>⚙️ Settings</h2>
        <p>Workspace: {{ eventBus?.workspaceId }}</p>
      </div>
      
      <div class="settings-section">
        <h3>Workspace Settings</h3>
        @if (settingsStore.hasWorkspaceSettings()) {
          <div class="setting-item">
            <label>Timezone: {{ settingsStore.workspaceSettings()?.timezone }}</label>
          </div>
          <div class="setting-item">
            <label>Notifications: {{ settingsStore.notificationsEnabled() ? 'Enabled' : 'Disabled' }}</label>
          </div>
        } @else {
          <div class="empty-state">No workspace settings</div>
        }
      </div>

      <div class="preferences-section">
        <h3>User Preferences</h3>
        @if (settingsStore.hasUserPreferences()) {
          <div class="setting-item">
            <label>Theme</label>
            <select [(ngModel)]="theme" (change)="updateTheme()" class="input-field">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        } @else {
          <button (click)="initializePreferences()" class="btn-primary">Initialize Preferences</button>
        }
      </div>
    </div>
  `,
  styles: [`
    .settings-module { padding: 1.5rem; max-width: 800px; }
    .module-header h2 { margin: 0 0 0.5rem 0; color: #1976d2; }
    .settings-section, .preferences-section { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
    .setting-item { margin-bottom: 1rem; }
    .setting-item label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .input-field { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    .btn-primary { padding: 0.5rem 1rem; border: none; border-radius: 4px; background: #1976d2; color: white; cursor: pointer; }
    .empty-state { text-align: center; color: #999; padding: 1rem; }
  `]
})
export class SettingsModule implements IAppModule, OnInit, OnDestroy {
  readonly id = 'settings';
  readonly name = 'Settings';
  readonly type: ModuleType = 'settings';
  
  @Input() eventBus?: IModuleEventBus;
  readonly settingsStore = inject(SettingsStore);
  
  theme = 'system';
  private subscriptions = ModuleEventHelper.createSubscriptionManager();
  
  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }
  
  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;
    
    // Initialize demo settings
    this.settingsStore.setWorkspaceSettings({
      workingHours: { start: '09:00', end: '17:00' },
      timezone: 'UTC',
      defaultTaskPriority: 'medium',
      enableNotifications: true,
      enableAutoAssignment: false,
    });
    
    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.settingsStore.clearSettings();
      })
    );
    
    ModuleEventHelper.publishModuleInitialized(eventBus, this.id);
  }
  
  initializePreferences(): void {
    this.settingsStore.setUserPreferences({
      theme: 'system',
      language: 'en',
      compactMode: false,
      showCompletedTasks: true,
    });
  }
  
  updateTheme(): void {
    this.settingsStore.updateUserPreferences({ theme: this.theme as any });
  }
  
  activate(): void {}
  deactivate(): void {}
  destroy(): void {
    this.subscriptions.unsubscribeAll();
  }
  ngOnDestroy(): void {
    this.destroy();
  }
}
