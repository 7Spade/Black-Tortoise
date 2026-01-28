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
import { IssueAggregate, IssueRepository } from '@issues/domain';
import { IssueId } from '@issues/domain/value-objects/issue-id.vo';

@Injectable({
  providedIn: 'root',
})
export class IssueRepositoryImpl implements IssueRepository {
  private firestore = inject(Firestore);
  private readonly collectionName = 'issues';

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName);
  }

  private getDocRef(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`);
  }

  async findById(id: IssueId): Promise<IssueAggregate | null> {
    const docSnap = await getDoc(this.getDocRef(id.value));
    if (!docSnap.exists()) {
      return null;
    }
    return docSnap.data() as IssueAggregate;
  }

  async findByTaskId(taskId: string): Promise<IssueAggregate[]> {
    const q = query(
      this.getCollectionRef(),
      where('taskId', '==', taskId),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as IssueAggregate);
  }

  async findByAssignee(userId: string): Promise<IssueAggregate[]> {
    const q = query(
      this.getCollectionRef(),
      where('assigneeId', '==', userId),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as IssueAggregate);
  }

  async findByWorkspaceId(workspaceId: string): Promise<IssueAggregate[]> {
    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as IssueAggregate);
  }

  async save(issue: IssueAggregate): Promise<void> {
    await setDoc(this.getDocRef(issue.id.value), issue);
  }

  async delete(id: IssueId): Promise<void> {
    await deleteDoc(this.getDocRef(id.value));
  }
}
