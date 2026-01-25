/**
 * Create Workspace Use Case
 * 
 * Layer: Application
 * Purpose: Orchestrates workspace creation with proper event publishing
 */

import { Injectable } from '@angular/core';
import { WorkspaceEntity, WorkspaceId, createWorkspaceEntity } from '@domain/workspace';
import { createWorkspaceCreatedEvent } from '@domain/events/domain-events/workspace-created.event';

/**
 * Create Workspace Command
 */
export interface CreateWorkspaceCommand {
  readonly name: string;
  readonly organizationId: string;
  readonly organizationDisplayName: string;
  readonly ownerId: string;
  readonly ownerType: 'user' | 'organization';
  readonly moduleIds: string[];
}

/**
 * Create Workspace Use Case
 */
@Injectable({ providedIn: 'root' })
export class CreateWorkspaceUseCase {
  
  execute(command: CreateWorkspaceCommand): WorkspaceEntity {
    // Generate unique workspace ID
    const workspaceId = WorkspaceId.generate().getValue();
    
    // Create workspace entity
    const workspace = createWorkspaceEntity(
      workspaceId,
      command.name,
      command.organizationId,
      command.organizationDisplayName,
      command.ownerId,
      command.ownerType,
      command.moduleIds
    );
    
    // Create domain event using the factory function
    const event = createWorkspaceCreatedEvent(
      workspace.id,
      workspace.name,
      workspace.ownerId,
      workspace.ownerType,
      command.organizationId,
      command.ownerId
    );
    
    // In real implementation, this would:
    // 1. Persist to repository
    // 2. Publish event to event bus
    // 3. Return the created workspace
    
    console.log('[CreateWorkspaceUseCase] Workspace created:', workspace);
    console.log('[CreateWorkspaceUseCase] Event published:', event);
    
    return workspace;
  }
}
