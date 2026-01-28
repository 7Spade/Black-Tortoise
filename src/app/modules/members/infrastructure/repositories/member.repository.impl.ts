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
import { MemberAggregate } from '@members/domain/aggregates/member.aggregate';
import { MemberRepository } from '@members/domain/repositories/member.repository.interface';
import { MemberId } from '@members/domain/value-objects/member-id.vo';
import { WorkspaceId, UserId } from '@domain/value-objects';

@Injectable({ providedIn: 'root' })
export class MemberRepositoryImpl implements MemberRepository {
  private firestore = inject(Firestore);
  private collectionName = 'members';

  async findById(id: MemberId): Promise<MemberAggregate | null> {
    const d = await getDoc(doc(this.firestore, `${this.collectionName}/${id.value}`));
    return d.exists() ? (d.data() as MemberAggregate) : null;
  }
  async findByWorkspace(workspaceId: WorkspaceId): Promise<MemberAggregate[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('workspaceId', '==', workspaceId.value),
    );
    return (await getDocs(q)).docs.map((d) => d.data() as MemberAggregate);
  }
  async findByUserId(userId: UserId): Promise<MemberAggregate[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('userId', '==', userId.value),
    );
    return (await getDocs(q)).docs.map((d) => d.data() as MemberAggregate);
  }
  async findByUserAndWorkspace(userId: UserId, workspaceId: WorkspaceId): Promise<MemberAggregate | null> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('userId', '==', userId.value),
      where('workspaceId', '==', workspaceId.value),
    );
    const docs = await getDocs(q);
    const firstDoc = docs.docs[0];
    if (!firstDoc) return null;
    return firstDoc.data() as MemberAggregate;
  }
  async save(member: MemberAggregate): Promise<void> {
    await setDoc(
      doc(this.firestore, `${this.collectionName}/${member.id.value}`),
      member,
    );
  }
  async delete(id: MemberId): Promise<void> {
    await deleteDoc(doc(this.firestore, `${this.collectionName}/${id.value}`));
  }
}
