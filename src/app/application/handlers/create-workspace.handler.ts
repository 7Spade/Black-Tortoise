/**
 * Create Workspace Use Case
 * 
 * Layer: Application
 * Purpose: Orchestrates workspace creation with proper persistence and event publishing
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { WORKSPACE_REPOSITORY } from '@application/interfaces/workspace-repository.token';
import { createWorkspaceEntity, WorkspaceEntity } from '@domain/aggregates';
import { createWorkspaceCreatedEvent } from '@domain/events';
import { WorkspaceId } from '@domain/value-objects';

/**
 * Create Workspace Command
 */
export interface CreateWorkspaceCommand {
  readonly name: string;
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
  private readonly repository = inject(WORKSPACE_REPOSITORY);

  async execute(command: CreateWorkspaceCommand): Promise<WorkspaceEntity> {
    // Generate unique workspace ID
    const workspaceId = WorkspaceId.generate().getValue();
    
    // Create workspace entity
    const workspace = createWorkspaceEntity(
      workspaceId,
      command.name,
      command.ownerId,
      command.ownerType,
      command.moduleIds
    );
    
    // Persist to infrastructure
    await this.repository.save(workspace);
    
    // Create domain event using the factory function
    const event = createWorkspaceCreatedEvent(
      workspace.id,
      workspace.name,
      workspace.ownerId,
      workspace.ownerType,
      command.ownerType === 'user' ? command.ownerId : undefined,
      undefined
    );

    // Publish event asynchronously
    void this.publishEvent.execute({ event });
    
    return workspace;
  }
}



