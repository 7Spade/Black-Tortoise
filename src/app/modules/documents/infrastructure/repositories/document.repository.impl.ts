import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { DocumentAggregate, DocumentRepository, DocumentId } from '@documents/domain';
import { WorkspaceId } from '@domain/value-objects';

@Injectable({ providedIn: 'root' })
export class DocumentRepositoryImpl implements DocumentRepository {
  private firestore = inject(Firestore);
  private collectionName = 'documents';

  async findById(id: DocumentId): Promise<DocumentAggregate | undefined> {
    const d = await getDoc(
      doc(this.firestore, `${this.collectionName}/${id.toString()}`),
    );
    return d.exists() ? (d.data() as DocumentAggregate) : undefined;
  }

  async findByWorkspaceId(
    workspaceId: WorkspaceId,
  ): Promise<DocumentAggregate[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('workspaceId', '==', workspaceId),
    );
    return (await getDocs(q)).docs.map((d) => d.data() as DocumentAggregate);
  }

  async findByType(
    workspaceId: WorkspaceId,
    type: string,
  ): Promise<DocumentAggregate[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('workspaceId', '==', workspaceId),
      where('type', '==', type),
    );
    return (await getDocs(q)).docs.map((d) => d.data() as DocumentAggregate);
  }

  async findByOwnerId(ownerId: string): Promise<DocumentAggregate[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('ownerId', '==', ownerId),
    );
    return (await getDocs(q)).docs.map((d) => d.data() as DocumentAggregate);
  }

  async findByFolderPath(
    workspaceId: WorkspaceId,
    folderPath: string,
  ): Promise<DocumentAggregate[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('workspaceId', '==', workspaceId),
      where('folderPath', '==', folderPath),
    );
    return (await getDocs(q)).docs.map((d) => d.data() as DocumentAggregate);
  }

  async findModifiedAfter(
    workspaceId: WorkspaceId,
    date: Date,
  ): Promise<DocumentAggregate[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('workspaceId', '==', workspaceId),
      where('updatedAt', '>', date),
    );
    return (await getDocs(q)).docs.map((d) => d.data() as DocumentAggregate);
  }

  async searchByName(
    workspaceId: WorkspaceId,
    searchTerm: string,
  ): Promise<DocumentAggregate[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('workspaceId', '==', workspaceId),
    );
    const all = (await getDocs(q)).docs.map(
      (d) => d.data() as DocumentAggregate,
    );
    return all.filter((d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  async findByTags(
    workspaceId: WorkspaceId,
    tags: string[],
  ): Promise<DocumentAggregate[]> {
    if (tags.length === 0) return [];
    const q = query(
      collection(this.firestore, this.collectionName),
      where('workspaceId', '==', workspaceId),
      where('tags', 'array-contains-any', tags),
    );
    return (await getDocs(q)).docs.map((d) => d.data() as DocumentAggregate);
  }

  async save(document: DocumentAggregate): Promise<void> {
    await setDoc(doc(this.firestore, `${this.collectionName}/${document.id}`), {
      ...document,
    });
  }

  async delete(id: DocumentId): Promise<void> {
    await deleteDoc(
      doc(this.firestore, `${this.collectionName}/${id.toString()}`),
    );
  }

  async exists(id: DocumentId): Promise<boolean> {
    const d = await getDoc(
      doc(this.firestore, `${this.collectionName}/${id.toString()}`),
    );
    return d.exists();
  }

  async countByWorkspace(workspaceId: WorkspaceId): Promise<number> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('workspaceId', '==', workspaceId),
    );
    const snap = await getCountFromServer(q);
    return snap.data().count;
  }

  async countByType(workspaceId: WorkspaceId, type: string): Promise<number> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('workspaceId', '==', workspaceId),
      where('type', '==', type),
    );
    const snap = await getCountFromServer(q);
    return snap.data().count;
  }

  async getTotalStorageSize(workspaceId: WorkspaceId): Promise<number> {
    const docs = await this.findByWorkspaceId(workspaceId);
    return docs.reduce((sum, d) => sum + (d.size || 0), 0);
  }
}
