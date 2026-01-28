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
import { DailyEntryEntity, DailyRepository } from '@domain/daily';

@Injectable({ providedIn: 'root' })
export class DailyRepositoryImpl implements DailyRepository {
  private firestore = inject(Firestore);
  private collectionName = 'daily-entries';

  async findById(id: string): Promise<DailyEntryEntity | null> {
    const d = await getDoc(doc(this.firestore, `${this.collectionName}/${id}`));
    return d.exists() ? (d.data() as DailyEntryEntity) : null;
  }
  async findByUserAndDate(
    userId: string,
    date: string,
  ): Promise<DailyEntryEntity | null> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('userId', '==', userId),
      where('date', '==', date),
    );
    const snap = await getDocs(q);
    return snap.empty ? null : (snap.docs[0]!.data() as DailyEntryEntity);
  }
  async save(entry: DailyEntryEntity): Promise<void> {
    await setDoc(
      doc(this.firestore, `${this.collectionName}/${entry.id}`),
      entry,
    );
  }
}
