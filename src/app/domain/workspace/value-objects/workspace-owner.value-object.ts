import type { WorkspaceOwnerType } from '@domain/identity/identity.types';

/**
 * WorkspaceOwner encapsulates workspace ownership information.
 */
export class WorkspaceOwner {
  private readonly ownerId: string;
  private readonly ownerType: WorkspaceOwnerType;

  private constructor(ownerId: string, ownerType: WorkspaceOwnerType) {
    this.ownerId = ownerId;
    this.ownerType = ownerType;
  }

  static create(ownerId: string, ownerType: WorkspaceOwnerType): WorkspaceOwner {
    if (!ownerId || ownerId.trim().length === 0) {
      throw new Error('WorkspaceOwner ownerId cannot be empty');
    }
    if (ownerType !== 'user' && ownerType !== 'organization') {
      throw new Error('WorkspaceOwner ownerType must be user or organization');
    }
    return new WorkspaceOwner(ownerId.trim(), ownerType);
  }

  getOwnerId(): string {
    return this.ownerId;
  }

  getOwnerType(): WorkspaceOwnerType {
    return this.ownerType;
  }

  equals(other: WorkspaceOwner): boolean {
    return this.ownerId === other.ownerId && this.ownerType === other.ownerType;
  }

  isUserOwned(): boolean {
    return this.ownerType === 'user';
  }

  isOrganizationOwned(): boolean {
    return this.ownerType === 'organization';
  }
}
