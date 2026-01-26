/**
 * Workspace Repository Implementation
 * 
 * Layer: Infrastructure
 * DDD Pattern: Repository Implementation
 * Purpose: Concrete implementation of WorkspaceRepository using Firebase/Firestore
 */

import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getCountFromServer,
  getDoc,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';
import { WorkspaceEntity } from '@domain/aggregates/workspace.entity';
import { WorkspaceRepository } from '@domain/repositories';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class WorkspaceRepositoryImpl implements WorkspaceRepository {
  private readonly firestore = inject(Firestore);
  private readonly collectionPath = 'workspaces';

  /**
   * Find a workspace by its ID
   */
  async findById(id: string): Promise<WorkspaceEntity | undefined> {
    const docRef = doc(this.firestore, `${this.collectionPath}/${id}`);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return undefined;
    }
    
    const data = docSnap.data() as any;
    
    return {
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
    } as WorkspaceEntity;
  }

  /**
   * Find all workspaces owned by a user or organization
   */
  async findByOwnerId(ownerId: string, ownerType: 'user' | 'organization'): Promise<WorkspaceEntity[]> {
    const colRef = collection(this.firestore, this.collectionPath);
    const q = query(
      colRef, 
      where('ownerId', '==', ownerId),
      where('ownerType', '==', ownerType)
    );
    
    const docs$ = collectionData(q, { idField: 'id' }) as Observable<any[]>;
    const docs = await firstValueFrom(docs$);
    return this.mapDates(docs);
  }

  /**
   * Find all workspaces in an organization
   */
  async findByOrganizationId(organizationId: string): Promise<WorkspaceEntity[]> {
    const colRef = collection(this.firestore, this.collectionPath);
    const q = query(
      colRef, 
      where('organizationId', '==', organizationId)
    );
    
    const docs$ = collectionData(q, { idField: 'id' }) as Observable<any[]>;
    const docs = await firstValueFrom(docs$);
    return this.mapDates(docs);
  }

  /**
   * Find all active workspaces
   */
  async findAllActive(): Promise<WorkspaceEntity[]> {
    const colRef = collection(this.firestore, this.collectionPath);
    const docs$ = collectionData(colRef, { idField: 'id' }) as Observable<any[]>;
    const docs = await firstValueFrom(docs$);
    return this.mapDates(docs);
  }

  /**
   * Save a workspace (create or update)
   */
  async save(workspace: WorkspaceEntity): Promise<void> {
    const docRef = doc(this.firestore, `${this.collectionPath}/${workspace.id}`);
    await setDoc(docRef, workspace);
  }

  /**
   * Delete a workspace by ID
   */
  async delete(id: string): Promise<void> {
    const docRef = doc(this.firestore, `${this.collectionPath}/${id}`);
    await deleteDoc(docRef);
  }

  /**
   * Check if a workspace exists
   */
  async exists(id: string): Promise<boolean> {
    const docRef = doc(this.firestore, `${this.collectionPath}/${id}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  /**
   * Count total workspaces
   */
  async count(): Promise<number> {
    const colRef = collection(this.firestore, this.collectionPath);
    const snapshot = await getCountFromServer(colRef);
    return snapshot.data().count;
  }

  /**
   * Count workspaces by owner
   */
  async countByOwner(ownerId: string): Promise<number> {
    const colRef = collection(this.firestore, this.collectionPath);
    const q = query(colRef, where('ownerId', '==', ownerId));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  private mapDates(docs: any[]): WorkspaceEntity[] {
    return docs.map(d => ({
      ...d,
      createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : d.createdAt,
      updatedAt: d.updatedAt?.toDate ? d.updatedAt.toDate() : d.updatedAt,
    })) as WorkspaceEntity[];
  }
}




