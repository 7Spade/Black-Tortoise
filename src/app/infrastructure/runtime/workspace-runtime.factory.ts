/**
 * Workspace Runtime Factory
 * 
 * Layer: Infrastructure
 * Purpose: Factory for creating workspace runtime instances
 * 
 * Each workspace gets its own runtime with a scoped event bus
 */

import { Injectable } from '@angular/core';
import { WorkspaceEntity } from '../../domain/workspace/workspace.entity';
import { WorkspaceContext, createWorkspaceContext, createDefaultPermissions } from '../../domain/workspace/workspace-context';
import { WorkspaceEventBus } from '../../domain/workspace/workspace-event-bus';
import { InMemoryEventBus } from './in-memory-event-bus';

/**
 * Workspace Runtime
 * Combines workspace context with its scoped event bus
 */
export interface WorkspaceRuntime {
  readonly context: WorkspaceContext;
  readonly eventBus: WorkspaceEventBus;
}

/**
 * Workspace Runtime Factory
 * Creates isolated runtime environments for each workspace
 */
@Injectable({ providedIn: 'root' })
export class WorkspaceRuntimeFactory {
  private readonly runtimes = new Map<string, WorkspaceRuntime>();
  
  /**
   * Create or get workspace runtime
   */
  createRuntime(workspace: WorkspaceEntity): WorkspaceRuntime {
    const existingRuntime = this.runtimes.get(workspace.id);
    if (existingRuntime) {
      return existingRuntime;
    }
    
    // Create scoped event bus for this workspace
    const eventBus = new InMemoryEventBus(workspace.id);
    
    // Create workspace context with default permissions
    // In real app, permissions would be loaded based on user role
    const context = createWorkspaceContext(workspace, {
      canEditWorkspace: true,
      canManageModules: true,
      canInviteMembers: true,
      canDeleteWorkspace: true,
    });
    
    const runtime: WorkspaceRuntime = {
      context,
      eventBus,
    };
    
    this.runtimes.set(workspace.id, runtime);
    
    console.log('[WorkspaceRuntimeFactory] Created runtime for:', workspace.id);
    
    return runtime;
  }
  
  /**
   * Get existing runtime
   */
  getRuntime(workspaceId: string): WorkspaceRuntime | null {
    return this.runtimes.get(workspaceId) || null;
  }
  
  /**
   * Destroy runtime and cleanup resources
   */
  destroyRuntime(workspaceId: string): void {
    const runtime = this.runtimes.get(workspaceId);
    if (runtime) {
      runtime.eventBus.clear();
      this.runtimes.delete(workspaceId);
      console.log('[WorkspaceRuntimeFactory] Destroyed runtime for:', workspaceId);
    }
  }
  
  /**
   * Cleanup all runtimes
   */
  destroyAll(): void {
    this.runtimes.forEach((runtime, workspaceId) => {
      runtime.eventBus.clear();
    });
    this.runtimes.clear();
    console.log('[WorkspaceRuntimeFactory] Destroyed all runtimes');
  }
}
