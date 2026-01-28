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
import { TaskAggregate, TaskRepository } from '@tasks/domain';
import { TaskId } from '@tasks/domain/value-objects/task-id.vo';
import { TaskStatus } from '@tasks/domain/value-objects/task-status.vo';
import { WorkspaceId, UserId } from '@domain/value-objects';

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

  async findById(id: TaskId): Promise<TaskAggregate | null> {
    const docSnap = await getDoc(this.getDocRef(id.value));
    if (!docSnap.exists()) {
      return null;
    }
    return docSnap.data() as TaskAggregate;
  }

  async findByWorkspace(workspaceId: WorkspaceId): Promise<TaskAggregate[]> {
    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId.value),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as TaskAggregate);
  }

  async findByAssignee(assigneeId: UserId): Promise<TaskAggregate[]> {
    const q = query(
      this.getCollectionRef(),
      where('assigneeId', '==', assigneeId.value),
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
      where('workspaceId', '==', workspaceId.value),
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
      where('workspaceId', '==', workspaceId.value),
      where('priority', '==', priority),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as TaskAggregate);
  }

  async findOverdue(workspaceId: WorkspaceId): Promise<TaskAggregate[]> {
    const now = Date.now();
    // Simplified status check for overdue
    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId.value),
      where('dueDate', '<', now),
      where('status', '!=', 'COMPLETED'),
    );

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

    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId.value),
      where('dueDate', '>=', start),
      where('dueDate', '<=', end),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as TaskAggregate);
  }

  async save(task: TaskAggregate): Promise<void> {
    await setDoc(this.getDocRef(task.id.value), task);
  }

  async delete(id: TaskId): Promise<void> {
    await deleteDoc(this.getDocRef(id.value));
  }

  async exists(id: TaskId): Promise<boolean> {
    const docSnap = await getDoc(this.getDocRef(id.value));
    return docSnap.exists();
  }

  async countByWorkspace(workspaceId: WorkspaceId): Promise<number> {
    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId.value),
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
      where('workspaceId', '==', workspaceId.value),
      where('status', '==', status),
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }
}
