/**
 * Workspace Runtime Factory Interface
 * 
 * Layer: Application
 * Purpose: Abstract interface for workspace runtime management
 * 
 * This interface defines the contract for creating and managing workspace runtimes.
 * The concrete implementation lives in the Infrastructure layer.
 * 
 * Clean Architecture Compliance:
 * - Application depends on this abstraction
 * - Infrastructure implements this interface
 * - Presentation accesses via Application facades
 */

import { WorkspaceEntity, WorkspaceContext, WorkspaceEventBus } from '@domain/workspace';

/**
 * Workspace Runtime
 * Combines workspace context with its scoped event bus
 */
export interface WorkspaceRuntime {
  readonly context: WorkspaceContext;
  readonly eventBus: WorkspaceEventBus;
}

/**
 * Workspace Runtime Factory Interface
 * Abstract interface for managing workspace runtimes
 */
export interface IWorkspaceRuntimeFactory {
  /**
   * Create or get workspace runtime
   */
  createRuntime(workspace: WorkspaceEntity): WorkspaceRuntime;
  
  /**
   * Get existing runtime
   */
  getRuntime(workspaceId: string): WorkspaceRuntime | null;
  
  /**
   * Destroy runtime and cleanup resources
   */
  destroyRuntime(workspaceId: string): void;
  
  /**
   * Cleanup all runtimes
   */
  destroyAll(): void;
}
