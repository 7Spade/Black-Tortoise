/**
 * Workspace Runtime Factory
 * 
 * Layer: Infrastructure
 * Purpose: Factory for creating workspace runtime instances
 * 
 * Each workspace gets its own runtime with a scoped event bus
 * 
 * Clean Architecture Compliance:
 * - Implements IWorkspaceRuntimeFactory from Application layer
 * - Registered via DI token in app.config.ts
 * - Application and Presentation use abstraction, not this class
 */

import { Injectable } from '@angular/core';
import { IWorkspaceRuntimeFactory, WorkspaceRuntime } from '@workspace/application';
import { WorkspaceContext, Workspace, createWorkspaceContext } from '@workspace/domain';
import { WorkspaceInMemoryEventBus } from '@infrastructure/factories/in-memory-event-bus';

/**
 * Workspace Runtime Factory Implementation
 * Creates isolated runtime environments for each workspace
 */
@Injectable()
export class WorkspaceRuntimeFactory implements IWorkspaceRuntimeFactory {
  private readonly runtimes = new Map<string, WorkspaceRuntime>();

  /**
   * Create or get workspace runtime
   */
  createRuntime(workspace: Workspace): WorkspaceRuntime {
    const workspaceId = workspace.id.getValue();
    const existingRuntime = this.runtimes.get(workspaceId);
    if (existingRuntime) {
      return existingRuntime;
    }

    // Create scoped event bus for this workspace
    const eventBus = new WorkspaceInMemoryEventBus(workspaceId);

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

    this.runtimes.set(workspaceId, runtime);

    console.log('[WorkspaceRuntimeFactory] Created runtime for:', workspaceId);

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



