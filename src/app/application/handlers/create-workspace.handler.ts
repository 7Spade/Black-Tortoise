/**
 * Create Workspace Use Case
 * 
 * Layer: Application
 * Purpose: Orchestrates workspace creation with proper event publishing
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { createWorkspaceCreatedEvent } from '@domain/events';
import { createWorkspaceEntity, WorkspaceEntity } from '@domain/aggregates';
import { WorkspaceId } from '@domain/value-objects';

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
export class CreateWorkspaceHandler {
  private readonly publishEvent = inject(PublishEventHandler);

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

    void this.publishEvent.execute({ event });
    
    return workspace;
  }
}



