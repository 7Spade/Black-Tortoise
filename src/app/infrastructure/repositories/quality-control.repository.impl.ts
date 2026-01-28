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
import { QCCheckEntity, QualityControlRepository } from '@domain/quality-control';

@Injectable({ providedIn: 'root' })
export class QualityControlRepositoryImpl implements QualityControlRepository {
  private firestore = inject(Firestore);
  private collectionName = 'qc-checks';

  async findByTaskId(taskId: string): Promise<QCCheckEntity | null> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('taskId', '==', taskId),
    );
    const snap = await getDocs(q);
    return snap.empty ? null : (snap.docs[0]!.data() as QCCheckEntity);
  }
  async save(entity: QCCheckEntity): Promise<void> {
    await setDoc(
      doc(this.firestore, `${this.collectionName}/${entity.id}`),
      entity,
    );
  }
}
