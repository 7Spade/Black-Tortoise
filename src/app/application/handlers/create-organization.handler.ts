/**
 * Create Organization Use Case
 * 
 * Layer: Application
 * Purpose: Orchestrates organization creation
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import {
  ORGANIZATION_REPOSITORY,
  Organization,
  OrganizationId,
  UserId
} from '@account/index';
import { createOrganizationCreatedEvent } from '@domain/events/organization-created.event';

/**
 * Create Organization Command
 */
export interface CreateOrganizationCommand {
  readonly displayName: string;
  readonly ownerId: string;
}

@Injectable({ providedIn: 'root' })
export class CreateOrganizationHandler {
  private readonly publishEvent = inject(PublishEventHandler);
  private readonly repository = inject(ORGANIZATION_REPOSITORY);

  async execute(command: CreateOrganizationCommand): Promise<Organization> {
    // Generate ID
    const organizationId = OrganizationId.generate();
    const ownerId = UserId.create(command.ownerId);

    // Create Entity
    const organization = Organization.create(
      organizationId,
      ownerId,
      command.displayName
    );

    // Save
    await this.repository.save(organization);

    // Publish Event
    const event = createOrganizationCreatedEvent(
      organizationId.toString(),
      organization.displayName,
      ownerId.toString()
    );

    await this.publishEvent.execute({ event });

    return organization;
  }
}
