import type { Observable } from 'rxjs';
import type { Workspace } from '../entities/workspace.entity';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';

/**
 * WorkspaceRepository defines the contract for workspace persistence.
 */
export interface WorkspaceRepository {
  getWorkspacesByOwner(
    ownerType: WorkspaceOwnerType,
    ownerId: string,
  ): Observable<Workspace[]>;
}
