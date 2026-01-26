/**
 * Switch Workspace Use Case
 * 
 * Layer: Application
 * Purpose: Orchestrates workspace switching with event publishing
 */

import { Injectable } from '@angular/core';
import { createWorkspaceSwitchedEvent } from '@domain/events';

/**
 * Switch Workspace Command
 */
export interface SwitchWorkspaceCommand {
  readonly previousWorkspaceId: string | null;
  readonly targetWorkspaceId: string;
  readonly userId?: string;
  readonly correlationId?: string;
}

/**
 * Switch Workspace Use Case
 */
@Injectable({ providedIn: 'root' })
export class SwitchWorkspaceHandler {
  
  execute(command: SwitchWorkspaceCommand): void {
    // Create domain event using factory function
    const event = createWorkspaceSwitchedEvent(
      command.previousWorkspaceId,
      command.targetWorkspaceId,
      command.userId,
      command.correlationId
    );
    
    // In real implementation:
    // 1. Validate target workspace exists and user has access
    // 2. Cleanup previous workspace context
    // 3. Load new workspace context
    // 4. Publish event to workspace-scoped event bus
    // 5. Update application state
    
    console.log('[SwitchWorkspaceHandler] Workspace switched:', event);
  }
}

