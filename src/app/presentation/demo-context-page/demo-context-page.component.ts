/**
 * Demo Context Page Component
 * 
 * Domain-Driven Design: Presentation Layer
 * Layer: Presentation (UI Components)
 * Architecture: Zone-less, Signal-based, OnPush
 * 
 * This component demonstrates the global application context store
 * using pure signal-based reactivity without Zone.js.
 * 
 * Key Features:
 * - Standalone component (no NgModule required)
 * - OnPush change detection strategy (optimal performance)
 * - Signal-based subscriptions (no manual subscriptions)
 * - Modern template syntax (@if, @for)
 * - DDD boundary compliance (Presentation → Application → Domain)
 * 
 * Zone-less Architecture:
 * - All state access is via signals
 * - Change detection is triggered by signal updates
 * - No manual markForCheck() required
 * - Compatible with Angular 20's zone-less mode
 */

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationContextStore } from '@application/stores/application-context.store';
import { ModuleType } from '@application/stores/application-context.state';

@Component({
  selector: 'app-demo-context-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demo-context-page.component.html',
  styleUrls: ['./demo-context-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // OnPush for optimal performance
})
export class DemoContextPageComponent {
  /**
   * Inject the global application context store
   * This is a singleton provided at root level
   */
  readonly appContext = inject(ApplicationContextStore);
  
  /**
   * Available module types for the module selector
   * This is a static list for the demo UI
   */
  readonly availableModules: ReadonlyArray<{ type: ModuleType; label: string; icon: string }> = [
    { type: 'overview', label: 'Overview', icon: '📊' },
    { type: 'documents', label: 'Documents', icon: '📄' },
    { type: 'tasks', label: 'Tasks', icon: '✓' },
    { type: 'calendar', label: 'Calendar', icon: '📅' },
    { type: 'settings', label: 'Settings', icon: '⚙️' },
  ];
  
  /**
   * Load demo data into the store
   * This populates the store with sample data for demonstration
   */
  loadDemo(): void {
    this.appContext.loadDemoData();
  }
  
  /**
   * Select a workspace
   * This updates the current workspace context
   * 
   * @param workspaceId - The ID of the workspace to select
   */
  onSelectWorkspace(workspaceId: string): void {
    const workspace = this.appContext.availableWorkspaces()
      .find(ws => ws.id === workspaceId);
    
    if (workspace) {
      this.appContext.selectWorkspace(workspace);
    }
  }
  
  /**
   * Select a module
   * This updates the current module context
   * 
   * @param moduleType - The type of module to activate
   */
  onSelectModule(moduleType: ModuleType): void {
    this.appContext.selectModule(moduleType);
  }
  
  /**
   * Clear error
   * This resets the error state
   */
  onClearError(): void {
    this.appContext.clearError();
  }
  
  /**
   * Reset store
   * This resets all state to initial values
   */
  onReset(): void {
    this.appContext.reset();
  }
  
  /**
   * Check if module is enabled in current workspace
   * Helper method for UI logic
   * 
   * @param moduleType - The module type to check
   * @returns True if the module is enabled
   */
  isModuleEnabled(moduleType: ModuleType): boolean {
    return this.appContext.activeWorkspaceModules().includes(moduleType);
  }
}
