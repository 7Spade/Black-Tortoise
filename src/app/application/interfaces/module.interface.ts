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
