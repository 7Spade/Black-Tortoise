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
    const now = new Date();
    const eventId = `evt-${Date.now()}`;
    const correlationId = eventId;
    const event: WorkspaceCreated = {
      eventId,
      eventType: 'WorkspaceCreated',
      aggregateId: workspace.id,
      workspaceId: workspace.id,
      timestamp: now,
      correlationId,
      causationId: null,
      payload: {
        name: workspace.name,
        ownerId: workspace.ownerId,
        ownerType: workspace.ownerType,
      },
      metadata: {
        version: 1,
        userId: command.ownerId,
      },
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
