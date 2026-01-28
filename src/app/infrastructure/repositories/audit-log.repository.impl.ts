import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { AuditLogEntity, AuditLogRepository } from '@domain/audit';

@Injectable({ providedIn: 'root' })
export class AuditLogRepositoryImpl implements AuditLogRepository {
  private firestore = inject(Firestore);
  private collectionName = 'audit-logs';

  async findById(id: string): Promise<AuditLogEntity | null> {
    const d = await getDoc(doc(this.firestore, `${this.collectionName}/${id}`));
    return d.exists() ? (d.data() as AuditLogEntity) : null;
  }
  async findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('workspaceId', '==', workspaceId),
    );
    return (await getDocs(q)).docs.map((d) => d.data() as AuditLogEntity);
  }
  async save(entry: AuditLogEntity): Promise<void> {
    await setDoc(
      doc(this.firestore, `${this.collectionName}/${entry.id}`),
      entry,
    );
  }
}
