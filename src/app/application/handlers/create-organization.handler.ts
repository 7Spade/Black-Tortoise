/**
 * Create Organization Use Case
 * 
 * Layer: Application
 * Purpose: Orchestrates organization creation
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { ORGANIZATION_REPOSITORY } from '@application/interfaces/organization-repository.token';
import { Organization } from '@domain/entities/organization.entity';
import { createOrganizationCreatedEvent } from '@domain/events/organization-created.event';
import { OrganizationId } from '@domain/value-objects/organization-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';

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
    const event = createOrganizationCreatedEvent({
      organizationId: organizationId.toString(),
      organizationName: organization.displayName,
      ownerId: ownerId.toString()
    });

    await this.publishEvent.execute({ event });

    return organization;
  }
}
