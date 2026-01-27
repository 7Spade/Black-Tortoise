import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { AcceptanceCheckEntity } from '@domain/aggregates';
import { AcceptanceRepository } from '@domain/repositories';

@Injectable({ providedIn: 'root' })
export class AcceptanceRepositoryImpl implements AcceptanceRepository {
  private firestore = inject(Firestore);
  private collectionName = 'acceptance-checks';

  async findByTaskId(taskId: string): Promise<AcceptanceCheckEntity | null> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('taskId', '==', taskId),
    );
    const snap = await getDocs(q);
    return snap.empty ? null : (snap.docs[0]!.data() as AcceptanceCheckEntity);
  }
  async findByWorkspaceId(
    workspaceId: string,
  ): Promise<AcceptanceCheckEntity[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('workspaceId', '==', workspaceId),
    );
    return (await getDocs(q)).docs.map(
      (d) => d.data() as AcceptanceCheckEntity,
    );
  }
  async save(entity: AcceptanceCheckEntity): Promise<void> {
    await setDoc(
      doc(this.firestore, `${this.collectionName}/${entity.id}`),
      entity,
    );
  }
}
