/**
 * Create Workspace Use Case
 * 
 * Layer: Application
 * Purpose: Orchestrates workspace creation with proper persistence and event publishing
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { WORKSPACE_REPOSITORY } from '../interfaces/workspace-repository.token';
import { WorkspaceId, Workspace } from '@workspace/domain';
import { createWorkspaceCreatedEvent } from '@eventing/domain/events/workspace-created.event';

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

  async execute(command: CreateWorkspaceCommand): Promise<Workspace> {
    // Generate unique workspace ID
    const workspaceId = WorkspaceId.generate().getValue();

    // Create workspace aggregate
    const workspace = Workspace.create(
      WorkspaceId.create(workspaceId),
      command.name,
      command.ownerId as any,
      command.ownerType,
      command.moduleIds
    );

    // Persist to infrastructure
    await this.repository.save(workspace);

    // Create domain event using the factory function
    const event = createWorkspaceCreatedEvent(
      workspace.id.getValue(),
      workspace.name,
      workspace.ownerId.getValue(),
      command.ownerType,
      command.ownerType === 'user' ? command.ownerId : undefined,
      undefined
    );

    // Publish event asynchronously
    void this.publishEvent.execute({ event });

    return workspace;
  }
}



