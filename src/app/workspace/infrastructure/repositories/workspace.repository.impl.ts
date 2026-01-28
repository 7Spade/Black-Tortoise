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
  getDocs,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';
import { Workspace, WorkspaceRepository } from '@workspace/domain';
import { WorkspaceId } from '@workspace/domain';

@Injectable()
export class WorkspaceRepositoryImpl implements WorkspaceRepository {
  private readonly firestore = inject(Firestore);
  private readonly collectionPath = 'workspaces';

  private mapDoc(id: string, data: any): Workspace {
    return Workspace.create(
      WorkspaceId.create(id),
      data.name,
      data.ownerId,
      data.ownerType || 'user', // Default to user if not specified
      data.moduleIds || []
    );
  }

  /**
   * Find a workspace by its ID
   */
  async findById(id: string): Promise<Workspace | undefined> {
    const docRef = doc(this.firestore, `${this.collectionPath}/${id}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return undefined;
    }

    return this.mapDoc(id, docSnap.data());
  }

  /**
   * Find all workspaces owned by a user or organization
   */
  async findByOwnerId(ownerId: string, ownerType: 'user' | 'organization'): Promise<Workspace[]> {
    const colRef = collection(this.firestore, this.collectionPath);
    const q = query(
      colRef,
      where('ownerId', '==', ownerId),
      where('ownerType', '==', ownerType)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => this.mapDoc(d.id, d.data()));
  }

  /**
   * Find all active workspaces
   */
  async findAllActive(): Promise<Workspace[]> {
    const colRef = collection(this.firestore, this.collectionPath);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => this.mapDoc(d.id, d.data()));
  }

  /**
   * Save a workspace (create or update)
   */
  async save(workspace: Workspace): Promise<void> {
    const docRef = doc(this.firestore, `${this.collectionPath}/${workspace.id}`);
    await setDoc(docRef, {
      name: workspace.name,
      ownerId: workspace.ownerId,
      ownerType: workspace.ownerType,
      moduleIds: workspace.moduleIds,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt
    }, { merge: true });
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
}




