import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { Workspace } from '@domain/workspace/entities/workspace.entity';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { WorkspaceOwner } from '@domain/workspace/value-objects/workspace-owner.value-object';
import { Collections } from '../collections/collection-names';
import { asString, asStringArray } from '../mappers/firestore-mappers';

@Injectable()
export class WorkspaceFirestoreRepository implements WorkspaceRepository {
  private readonly firestore = inject(Firestore);

  getWorkspacesByOwner(
    ownerType: WorkspaceOwnerType,
    ownerId: string,
  ): Observable<Workspace[]> {
    const workspacesRef = collection(this.firestore, Collections.workspaces);
    const workspaceQuery = query(
      workspacesRef,
      where('ownerType', '==', ownerType),
      where('ownerId', '==', ownerId),
    );
    return collectionData(workspaceQuery, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: WorkspaceId.create(asString(doc['id'])),
          owner: WorkspaceOwner.create(asString(doc['ownerId']), ownerType),
          moduleIds: asStringArray(doc['moduleIds']),
        })),
      ),
      map((workspaces) =>
        workspaces.map((workspace) => Workspace.create(workspace)),
      ),
    );
  }
}
