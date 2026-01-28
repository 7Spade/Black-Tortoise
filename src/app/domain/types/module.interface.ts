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

import { WorkspaceEventBus } from '@workspace/domain';

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
 * Extended to include all standard workspace modules
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




