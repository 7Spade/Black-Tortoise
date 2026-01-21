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
import type { ModuleRepository } from '@domain/modules/repositories/module.repository.interface';
import { WorkspaceModule } from '@domain/modules/entities/workspace-module.entity';
import { ModuleId } from '@domain/modules/value-objects/module-id.value-object';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { Collections } from '../collections/collection-names';
import { asString } from '../mappers/firestore-mappers';

@Injectable()
export class ModuleFirestoreRepository implements ModuleRepository {
  private readonly firestore = inject(Firestore);

  getWorkspaceModules(workspaceId: string): Observable<WorkspaceModule[]> {
    const modulesRef = collection(this.firestore, Collections.modules);
    const modulesQuery = query(
      modulesRef,
      where('workspaceId', '==', workspaceId),
    );
    return collectionData(modulesQuery, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: ModuleId.create(asString(doc['id'])),
          workspaceId: WorkspaceId.create(asString(doc['workspaceId'])),
          moduleKey: asString(doc['moduleKey']),
        })),
      ),
      map((modules) =>
        modules.map((module) => WorkspaceModule.create(module)),
      ),
    );
  }
}
