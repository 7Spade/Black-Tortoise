/**
 * Create Workspace Use Case
 * 
 * Layer: Application
 * Purpose: Orchestrates workspace creation with proper event publishing
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventUseCase } from '@application/events/use-cases/publish-event.use-case';
import { createWorkspaceCreatedEvent } from '@domain/shared/events/workspace/workspace-created.event';
import { createWorkspaceEntity, WorkspaceEntity, WorkspaceId } from '@domain/workspace';

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
  private readonly publishEvent = inject(PublishEventUseCase);

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
