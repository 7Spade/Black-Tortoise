/**
 * Module Interface
 * 
 * Layer: Domain
 * Purpose: Defines the contract for workspace modules
 * 
 * Semantic Rules:
 * - Module = capability plugin within a workspace
 * - Modules communicate via Event Bus only
 * - No direct module-to-module calls
 * - Each module is independent and self-contained
 */

import { WorkspaceEventBus } from '../workspace/workspace-event-bus';

/**
 * Module Lifecycle Interface
 */
export interface Module {
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
  readonly type: ModuleType;
  
  /**
   * Initialize module with workspace event bus
   */
  initialize(eventBus: WorkspaceEventBus): void;
  
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
 * Module Types
 * These correspond to the standard modules in the system spec
 */
export type ModuleType = 
  | 'overview' 
  | 'documents' 
  | 'tasks' 
  | 'calendar' 
  | 'settings';

/**
 * Module Metadata
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
 * Standard Module Metadata Definitions
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
