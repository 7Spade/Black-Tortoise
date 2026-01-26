/**
 * Settings Module - Workspace Configuration with Comprehensive Settings
 * Layer: Presentation
 * Architecture: Signal-based, Event-driven
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { SettingsStore } from '@application/stores/settings.store';
import { TaskPriority } from '@domain/aggregates';
import { ModuleEventHelper } from '@presentation/workspaces/modules/basic/module-event-helper';

@Component({
  selector: 'app-settings-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="settings-module">
      <div class="module-header">
        <h2>Workspace Settings</h2>
        <p>Workspace: {{ eventBus?.workspaceId }}</p>
      </div>

      <!-- Settings Navigation -->
      <div class="settings-nav">
        <button 
          [class.active]="activeTab() === 'workspace'"
          (click)="activeTab.set('workspace')"
          class="nav-btn">
          Workspace
        </button>
        <button 
          [class.active]="activeTab() === 'preferences'"
          (click)="activeTab.set('preferences')"
          class="nav-btn">
          Preferences
        </button>
        <button 
          [class.active]="activeTab() === 'notifications'"
          (click)="activeTab.set('notifications')"
          class="nav-btn">
          Notifications
        </button>
      </div>

      <!-- Workspace Settings Tab -->
      @if (activeTab() === 'workspace') {
        <div class="settings-section">
          <h3>Workspace Configuration</h3>
          
          @if (settingsStore.hasWorkspaceSettings()) {
            <div class="setting-group">
              <h4>Working Hours</h4>
              <div class="setting-row">
                <label>Start Time</label>
                <input 
                  type="time" 
                  [value]="settingsStore.workspaceSettings()?.workingHours?.start ?? '09:00'"
                  (change)="updateWorkingHours('start', $event)"
                  class="input-field" />
              </div>
              <div class="setting-row">
                <label>End Time</label>
                <input 
                  type="time" 
                  [value]="settingsStore.workspaceSettings()?.workingHours?.end ?? '17:00'"
                  (change)="updateWorkingHours('end', $event)"
                  class="input-field" />
              </div>
            </div>

            <div class="setting-group">
              <h4>General</h4>
              <div class="setting-row">
                <label>Timezone</label>
                <select 
                  [value]="settingsStore.workspaceSettings()?.timezone"
                  (change)="updateTimezone($event)"
                  class="input-field">
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
              <div class="setting-row">
                <label>Default Task Priority</label>
                <select 
                  [value]="settingsStore.workspaceSettings()?.defaultTaskPriority"
                  (change)="updateDefaultPriority($event)"
                  class="input-field">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div class="setting-group">
              <h4>Features</h4>
              <div class="setting-row toggle-row">
                <label>Enable Notifications</label>
                <input 
                  type="checkbox" 
                  [checked]="settingsStore.workspaceSettings()?.enableNotifications"
                  (change)="toggleNotifications($event)"
                  class="toggle-input" />
              </div>
              <div class="setting-row toggle-row">
                <label>Enable Auto-Assignment</label>
                <input 
                  type="checkbox" 
                  [checked]="settingsStore.workspaceSettings()?.enableAutoAssignment"
                  (change)="toggleAutoAssignment($event)"
                  class="toggle-input" />
              </div>
            </div>
          } @else {
            <div class="empty-state">No workspace settings configured</div>
          }
        </div>
      }

      <!-- User Preferences Tab -->
      @if (activeTab() === 'preferences') {
        <div class="settings-section">
          <h3>User Preferences</h3>
          
          @if (settingsStore.hasUserPreferences()) {
            <div class="setting-group">
              <h4>Appearance</h4>
              <div class="setting-row">
                <label>Theme</label>
                <select 
                  [(ngModel)]="theme" 
                  (change)="updateTheme()" 
                  class="input-field">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div class="setting-row toggle-row">
                <label>Compact Mode</label>
                <input 
                  type="checkbox" 
                  [checked]="settingsStore.userPreferences()?.compactMode"
                  (change)="toggleCompactMode($event)"
                  class="toggle-input" />
              </div>
            </div>

            <div class="setting-group">
              <h4>Display</h4>
              <div class="setting-row">
                <label>Language</label>
                <select 
                  [value]="settingsStore.userPreferences()?.language"
                  (change)="updateLanguage($event)"
                  class="input-field">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中�?</option>
                </select>
              </div>
              <div class="setting-row toggle-row">
                <label>Show Completed Tasks</label>
                <input 
                  type="checkbox" 
                  [checked]="settingsStore.userPreferences()?.showCompletedTasks"
                  (change)="toggleShowCompleted($event)"
                  class="toggle-input" />
              </div>
            </div>
          } @else {
            <button (click)="initializePreferences()" class="btn-primary">Initialize Preferences</button>
          }
        </div>
      }

      <!-- Notifications Tab -->
      @if (activeTab() === 'notifications') {
        <div class="settings-section">
          <h3>Notification Settings</h3>
          
          <div class="setting-group">
            <h4>Email Notifications</h4>
            <div class="setting-row toggle-row">
              <label>Task Assigned</label>
              <input type="checkbox" checked class="toggle-input" />
            </div>
            <div class="setting-row toggle-row">
              <label>Task Completed</label>
              <input type="checkbox" checked class="toggle-input" />
            </div>
            <div class="setting-row toggle-row">
              <label>QC Failed</label>
              <input type="checkbox" checked class="toggle-input" />
            </div>
          </div>

          <div class="setting-group">
            <h4>Push Notifications</h4>
            <div class="setting-row toggle-row">
              <label>Browser Notifications</label>
              <input type="checkbox" class="toggle-input" />
            </div>
            <div class="setting-row toggle-row">
              <label>Daily Summary</label>
              <input type="checkbox" class="toggle-input" />
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .settings-module { 
      padding: 1.5rem; 
      max-width: 900px; 
    }
    
    .module-header h2 { 
      margin: 0 0 0.5rem 0; 
      color: #1976d2; 
    }
    
    .settings-nav {
      display: flex;
      gap: 0.5rem;
      margin: 1rem 0;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 0;
    }
    
    .nav-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-weight: 500;
      color: #666;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
      margin-bottom: -2px;
    }
    
    .nav-btn.active {
      color: #1976d2;
      border-bottom-color: #1976d2;
    }
    
    .settings-section { 
      background: white; 
      border: 1px solid #e0e0e0; 
      border-radius: 8px; 
      padding: 1.5rem; 
      margin-top: 1rem; 
    }
    
    .settings-section h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.25rem;
    }
    
    .setting-group {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .setting-group:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .setting-group h4 {
      margin: 0 0 1rem 0;
      color: #666;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    
    .setting-row { 
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding: 0.75rem 0;
    }
    
    .setting-row:last-child {
      margin-bottom: 0;
    }
    
    .setting-row label { 
      font-weight: 500;
      color: #333;
      flex: 1;
    }
    
    .input-field { 
      flex: 0 0 200px;
      padding: 0.5rem; 
      border: 1px solid #ccc; 
      border-radius: 4px;
      font-size: 0.875rem;
    }
    
    .toggle-row {
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 4px;
    }
    
    .toggle-input {
      width: 48px;
      height: 24px;
      cursor: pointer;
    }
    
    .btn-primary { 
      padding: 0.75rem 1.5rem; 
      border: none; 
      border-radius: 4px; 
      background: #1976d2; 
      color: white; 
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }
    
    .btn-primary:hover {
      background: #1565c0;
    }
    
    .empty-state { 
      text-align: center; 
      color: #999; 
      padding: 2rem; 
    }
    
    @media (max-width: 768px) {
      .setting-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
      
      .input-field {
        width: 100%;
      }
    }
  `]
})
export class SettingsModule implements IAppModule, OnInit, OnDestroy {
  readonly id = 'settings';
  readonly name = 'Settings';
  readonly type: ModuleType = 'settings';
  
  @Input() eventBus: IModuleEventBus | undefined;
  readonly settingsStore = inject(SettingsStore);
  
  activeTab = signal<'workspace' | 'preferences' | 'notifications'>('workspace');
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
      defaultTaskPriority: TaskPriority.MEDIUM,
      enableNotifications: true,
      enableAutoAssignment: false,
    });
    
    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.settingsStore.clearSettings();
      })
    );
    
  }
  
  updateWorkingHours(field: 'start' | 'end', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const current = this.settingsStore.workspaceSettings();
    if (!current) return;
    
    this.settingsStore.updateWorkspaceSettings({
      workingHours: {
        ...current.workingHours,
        [field]: value
      }
    });
  }
  
  updateTimezone(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.settingsStore.updateWorkspaceSettings({ timezone: value });
  }
  
  updateDefaultPriority(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as any;
    this.settingsStore.updateWorkspaceSettings({ defaultTaskPriority: value });
  }
  
  toggleNotifications(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.settingsStore.updateWorkspaceSettings({ enableNotifications: checked });
  }
  
  toggleAutoAssignment(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.settingsStore.updateWorkspaceSettings({ enableAutoAssignment: checked });
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
  
  updateLanguage(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.settingsStore.updateUserPreferences({ language: value });
  }
  
  toggleCompactMode(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.settingsStore.updateUserPreferences({ compactMode: checked });
  }
  
  toggleShowCompleted(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.settingsStore.updateUserPreferences({ showCompletedTasks: checked });
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



