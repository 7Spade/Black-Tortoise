/**
 * Workspace Switcher Components
 * 
 * Layer: Presentation - Shared Components
 * Purpose: Modular workspace switcher components for header
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 * 
 * Exports:
 * - WorkspaceSwitcherContainerComponent: Main container (inject into header)
 * - WorkspaceTriggerComponent: Trigger button
 * - WorkspaceMenuComponent: Dropdown menu
 * - WorkspaceListItemComponent: Individual workspace item
 */

export { WorkspaceSwitcherContainerComponent } from './workspace-switcher-container.component';
export { WorkspaceTriggerComponent } from './workspace-trigger.component';
export { WorkspaceMenuComponent } from './workspace-menu.component';
export { WorkspaceListItemComponent } from './workspace-list-item.component';
export { WorkspaceItem } from './types';
