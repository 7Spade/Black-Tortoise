/**
 * Create Workspace Use Case
 * 
 * Layer: Application
 * Purpose: Orchestrates workspace creation with proper event publishing
 */

import { Injectable } from '@angular/core';
import { WorkspaceCreated } from '@domain/event/domain-event';
import { WorkspaceEntity, WorkspaceId, createWorkspaceEntity } from '@domain/workspace';

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
    
    // Create domain event
    const event: WorkspaceCreated = {
      eventId: `evt-${Date.now()}`,
      eventType: 'WorkspaceCreated',
      occurredAt: new Date(),
      workspaceId: workspace.id,
      ownerId: workspace.ownerId,
      ownerType: workspace.ownerType,
    };
    
    // In real implementation, this would:
    // 1. Persist to repository
    // 2. Publish event to event bus
    // 3. Return the created workspace
    
    console.log('[CreateWorkspaceUseCase] Workspace created:', workspace);
    console.log('[CreateWorkspaceUseCase] Event published:', event);
    
    return workspace;
  }
}
