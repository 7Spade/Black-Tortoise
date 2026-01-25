/**
 * Workspace Switcher Support Components
 * 
 * Layer: Presentation - Shared Components
 * Purpose: Reusable sub-components for workspace switcher
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 * 
 * NOTE: The main WorkspaceSwitcherComponent lives in features/workspace
 * These are optional sub-components for custom implementations
 * 
 * Exports:
 * - WorkspaceTriggerComponent: Trigger button (optional)
 * - WorkspaceMenuComponent: Dropdown menu (optional)
 * - WorkspaceListItemComponent: Individual workspace item (optional)
 */

export { WorkspaceTriggerComponent } from './workspace-trigger.component';
export { WorkspaceMenuComponent } from './workspace-menu.component';
export { WorkspaceListItemComponent } from './workspace-list-item.component';
export { WorkspaceItem } from './types';
