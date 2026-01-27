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
import { MoneyMapper } from '@infrastructure/mappers/money.mapper';

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

  private mapToFirestore(task: TaskAggregate): any {
    return {
      ...task,
      unitPrice: MoneyMapper.toDTO(task.unitPrice),
      totalPrice: MoneyMapper.toDTO(task.totalPrice),
      subtaskIds: Array.from(task.subtaskIds),
      assigneeIds: Array.from(task.assigneeIds),
      collaboratorIds: Array.from(task.collaboratorIds),
      blockedByIssueIds: Array.from(task.blockedByIssueIds),
    };
  }

  private mapFromFirestore(data: any): TaskAggregate {
    return {
      ...data,
      unitPrice: MoneyMapper.toDomain(data.unitPrice),
      totalPrice: MoneyMapper.toDomain(data.totalPrice),
      subtaskIds: data.subtaskIds || [],
      assigneeIds: data.assigneeIds || [],
      collaboratorIds: data.collaboratorIds || [],
      blockedByIssueIds: data.blockedByIssueIds || [],
      quantity: data.quantity ?? 1,
      progress: data.progress ?? 0,
      parentId: data.parentId ?? null,
      responsibleId: data.responsibleId ?? null,
    } as TaskAggregate;
  }

  async findById(id: TaskId): Promise<TaskAggregate | undefined> {
    const docSnap = await getDoc(this.getDocRef(id.toString()));
    if (!docSnap.exists()) {
      return undefined;
    }
    return this.mapFromFirestore(docSnap.data());
  }

  async findByWorkspaceId(workspaceId: WorkspaceId): Promise<TaskAggregate[]> {
    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => this.mapFromFirestore(doc.data()));
  }

  async findByParentId(parentId: string): Promise<TaskAggregate[]> {
    const q = query(
      this.getCollectionRef(),
      where('parentId', '==', parentId),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => this.mapFromFirestore(doc.data()));
  }

  async findByAssigneeId(assigneeId: string): Promise<TaskAggregate[]> {
    const q = query(
      this.getCollectionRef(),
      where('assigneeId', '==', assigneeId),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => this.mapFromFirestore(doc.data()));
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
    return querySnapshot.docs.map((doc) => this.mapFromFirestore(doc.data()));
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
    return querySnapshot.docs.map((doc) => this.mapFromFirestore(doc.data()));
  }

  async findOverdue(workspaceId: WorkspaceId): Promise<TaskAggregate[]> {
    const now = Date.now();
    const q = query(
      this.getCollectionRef(),
      where('workspaceId', '==', workspaceId),
      where('dueDate', '<', now),
      where('status', '!=', TaskStatus.COMPLETED),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => this.mapFromFirestore(doc.data()));
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
      where('workspaceId', '==', workspaceId),
      where('dueDate', '>=', start),
      where('dueDate', '<=', end),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => this.mapFromFirestore(doc.data()));
  }

  async save(task: TaskAggregate): Promise<void> {
    await setDoc(this.getDocRef(task.id), this.mapToFirestore(task));
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
