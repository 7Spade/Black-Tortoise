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
import { TaskAggregate, TaskStatus } from '@domain/aggregates';
import { TaskRepository } from '@domain/repositories';
import { TaskId, WorkspaceId } from '@domain/value-objects';

@Injectable({
  providedIn: 'root',
})
export class TaskRepositoryImpl implements TaskRepository {
  private firestore = inject(Firestore);
  private readonly collectionName = 'tasks';

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName);
  }

  private getDocRef(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`);
  }

  async findById(id: TaskId): Promise<TaskAggregate | undefined> {
    const docSnap = await getDoc(this.getDocRef(id.toString()));
    if (!docSnap.exists()) {
      return undefined;
    }
    return docSnap.data() as TaskAggregate;
  }

  async findByWorkspaceId(workspaceId: WorkspaceId): Promise<TaskAggregate[]> {
    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as TaskAggregate);
  }

  async findByAssigneeId(assigneeId: string): Promise<TaskAggregate[]> {
    const q = query(
      this.getCollectionRef(),
      where('assigneeId', '==', assigneeId),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as TaskAggregate);
  }

  async findByStatus(
    workspaceId: WorkspaceId,
    status: string,
  ): Promise<TaskAggregate[]> {
    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId),
      where('status', '==', status),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as TaskAggregate);
  }

  async findByPriority(
    workspaceId: WorkspaceId,
    priority: string,
  ): Promise<TaskAggregate[]> {
    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId),
      where('priority', '==', priority),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as TaskAggregate);
  }

  async findOverdue(workspaceId: WorkspaceId): Promise<TaskAggregate[]> {
    const now = Date.now();
    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId),
      where('dueDate', '<', now),
      where('status', '!=', TaskStatus.COMPLETED),
    );
    // Note: status '!=' query requires composite index with dueDate probably.
    // Simplifying to client-side filter if complex indexes are not set up,
    // but for now let's try strict query.
    // Actually != is supported but restrictions apply.
    // Safer to query by dueDate < now and filter in memory for status/workspace if needed
    // or just let Firestore handle it if index exists.

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as TaskAggregate);
  }

  async findByDueDateRange(
    workspaceId: WorkspaceId,
    startDate: Date,
    endDate: Date,
  ): Promise<TaskAggregate[]> {
    const start = startDate.getTime();
    const end = endDate.getTime();

    // Firestore range queries on multiple fields can be tricky.
    // Query by workspaceId and filter by date range.
    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId),
      where('dueDate', '>=', start),
      where('dueDate', '<=', end),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as TaskAggregate);
  }

  async save(task: TaskAggregate): Promise<void> {
    await setDoc(this.getDocRef(task.id), task);
  }

  async delete(id: TaskId): Promise<void> {
    await deleteDoc(this.getDocRef(id.toString()));
  }

  async exists(id: TaskId): Promise<boolean> {
    const docSnap = await getDoc(this.getDocRef(id.toString()));
    return docSnap.exists();
  }

  async countByWorkspace(workspaceId: WorkspaceId): Promise<number> {
    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId),
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  async countByStatus(
    workspaceId: WorkspaceId,
    status: string,
  ): Promise<number> {
    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId),
      where('status', '==', status),
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }
}
