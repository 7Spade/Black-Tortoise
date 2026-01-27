import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { MemberAggregate } from '@domain/aggregates';
import { MemberRepository } from '@domain/repositories';

@Injectable({ providedIn: 'root' })
export class MemberRepositoryImpl implements MemberRepository {
  private firestore = inject(Firestore);
  private collectionName = 'members';

  async findById(id: string): Promise<MemberAggregate | null> {
    const d = await getDoc(doc(this.firestore, `${this.collectionName}/${id}`));
    return d.exists() ? (d.data() as MemberAggregate) : null;
  }
  async findByUserId(userId: string): Promise<MemberAggregate[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('userId', '==', userId),
    );
    return (await getDocs(q)).docs.map((d) => d.data() as MemberAggregate);
  }
  async findByWorkspaceId(workspaceId: string): Promise<MemberAggregate[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('workspaceId', '==', workspaceId),
    );
    return (await getDocs(q)).docs.map((d) => d.data() as MemberAggregate);
  }
  async save(member: MemberAggregate): Promise<void> {
    await setDoc(
      doc(this.firestore, `${this.collectionName}/${member.id}`),
      member,
    );
  }
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `${this.collectionName}/${id}`));
  }
}
