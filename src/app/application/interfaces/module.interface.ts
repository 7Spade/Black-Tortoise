/**
 * Application Module Interface
 * 
 * Layer: Application
 * Purpose: Application-layer module contract for Presentation components
 * 
 * This interface defines the module contract that Presentation layer
 * components implement. It mirrors the Domain Module interface but uses
 * Application-layer abstractions.
 * 
 * Clean Architecture Compliance:
 * - Presentation implements this interface
 * - Uses Application IModuleEventBus instead of Domain WorkspaceEventBus
 * - No direct Domain dependencies in Presentation
 */

import { IModuleEventBus } from './module-event-bus.interface';

/**
 * Module Lifecycle Interface (Application Layer)
 */
export interface IAppModule {
  /**
   * Unique module identifier
   */
  readonly id: string;

  /**
   * Module display name
   */
  readonly name: string;

  /**
   * Module type/category
   */
  readonly type: string;

  /**
   * Initialize module with event bus
   */
  initialize(eventBus: IModuleEventBus): void;

  /**
   * Activate module (when user navigates to it)
   */
  activate(): void;

  /**
   * Deactivate module (when user navigates away)
   */
  deactivate(): void;

  /**
   * Cleanup module resources
   */
  destroy(): void;
}

/**
 * Module Types (Application Layer)
 */
export type ModuleType =
  | 'overview'
  | 'documents'
  | 'tasks'
  | 'daily'
  | 'quality-control'
  | 'acceptance'
  | 'issues'
  | 'members'
  | 'permissions'
  | 'audit'
  | 'calendar'
  | 'settings';

/**
 * Module Metadata (Application Layer)
 */
export interface ModuleMetadata {
  readonly id: string;
  readonly type: ModuleType;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly routePath: string;
  readonly isDefault: boolean;
}

/**
 * Standard module metadata definitions (Application Layer)
 * UI-facing properties (icon, routePath) intentionally live here to keep
 * the Domain layer free from presentation concerns.
 */
export const STANDARD_MODULES: Record<ModuleType, Omit<ModuleMetadata, 'id'>> = {
  overview: {
    type: 'overview',
    name: 'Overview',
    description: 'Workspace overview dashboard',
    icon: 'dashboard',
    routePath: '/overview',
    isDefault: true,
  },
  documents: {
    type: 'documents',
    name: 'Documents',
    description: 'Document and folder management',
    icon: 'folder',
    routePath: '/documents',
    isDefault: true,
  },
  tasks: {
    type: 'tasks',
    name: 'Tasks',
    description: 'Task and todo management',
    icon: 'check_circle',
    routePath: '/tasks',
    isDefault: true,
  },
  daily: {
    type: 'daily',
    name: 'Daily',
    description: 'Daily standup and activity log',
    icon: 'today',
    routePath: '/daily',
    isDefault: false,
  },
  'quality-control': {
    type: 'quality-control',
    name: 'Quality Control',
    description: 'Quality assurance and control',
    icon: 'verified',
    routePath: '/quality-control',
    isDefault: false,
  },
  acceptance: {
    type: 'acceptance',
    name: 'Acceptance',
    description: 'Acceptance criteria and testing',
    icon: 'task_alt',
    routePath: '/acceptance',
    isDefault: false,
  },
  issues: {
    type: 'issues',
    name: 'Issues',
    description: 'Issue tracking and management',
    icon: 'bug_report',
    routePath: '/issues',
    isDefault: false,
  },
  members: {
    type: 'members',
    name: 'Members',
    description: 'Team member management',
    icon: 'people',
    routePath: '/members',
    isDefault: false,
  },
  permissions: {
    type: 'permissions',
    name: 'Permissions',
    description: 'Access control and permissions',
    icon: 'security',
    routePath: '/permissions',
    isDefault: false,
  },
  audit: {
    type: 'audit',
    name: 'Audit',
    description: 'Audit log and activity trail',
    icon: 'history',
    routePath: '/audit',
    isDefault: false,
  },
  calendar: {
    type: 'calendar',
    name: 'Calendar',
    description: 'Calendar and scheduling',
    icon: 'event',
    routePath: '/calendar',
    isDefault: true,
  },
  settings: {
    type: 'settings',
    name: 'Settings',
    description: 'Workspace settings',
    icon: 'settings',
    routePath: '/settings',
    isDefault: true,
  },
};
