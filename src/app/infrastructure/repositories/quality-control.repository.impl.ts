/**
 * QualityControl Repository Implementation
 *
 * Layer: Infrastructure - Repositories
 * Purpose: Firestore persistence for QC records
 */

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
  orderBy,
} from '@angular/fire/firestore';
import { QCCheckEntity, QCStatus } from '@domain/aggregates';
import { QualityControlRepository } from '@domain/repositories';
import { ChecklistItem } from '@domain/value-objects/checklist-item.vo';
import { TaskSnapshot } from '@domain/value-objects/task-snapshot.vo';

@Injectable({ providedIn: 'root' })
export class QualityControlRepositoryImpl implements QualityControlRepository {
  private firestore = inject(Firestore);
  private collectionName = 'qc-checks';

  async findById(id: string): Promise<QCCheckEntity | null> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    const snap = await getDoc(docRef);
    
    if (!snap.exists()) return null;
    
    return this.mapFromFirestore(snap.data());
  }

  async findByTaskId(taskId: string): Promise<QCCheckEntity | null> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('taskId', '==', taskId),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    
    if (snap.empty) return null;
    
    return this.mapFromFirestore(snap.docs[0]!.data());
  }

  async findHistoryByTaskId(taskId: string): Promise<ReadonlyArray<QCCheckEntity>> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('taskId', '==', taskId),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    
    return snap.docs.map(doc => this.mapFromFirestore(doc.data()));
  }

  async save(entity: QCCheckEntity): Promise<void> {
    const data = this.mapToFirestore(entity);
    await setDoc(
      doc(this.firestore, `${this.collectionName}/${entity.id}`),
      data,
    );
  }

  private mapToFirestore(entity: QCCheckEntity): any {
    return {
      id: entity.id,
      taskId: entity.taskId,
      workspaceId: entity.workspaceId,
      status: entity.status,
      checklistItems: entity.checklistItems.map(item => ({
        name: item.name,
        description: item.description,
        isRequired: item.isRequired,
        isPassed: item.isPassed,
        failureReason: item.failureReason,
      })),
      taskSnapshot: {
        title: entity.taskSnapshot.title,
        description: entity.taskSnapshot.description,
        quantity: entity.taskSnapshot.quantity,
        attachments: [...entity.taskSnapshot.attachments],
        completedAt: entity.taskSnapshot.completedAt,
        submittedBy: entity.taskSnapshot.submittedBy,
      },
      reviewer: entity.reviewer,
      reviewerAssignedAt: entity.reviewerAssignedAt,
      comments: entity.comments,
      checkedBy: entity.checkedBy,
      checkedAt: entity.checkedAt,
      createdAt: entity.createdAt,
    };
  }

  private mapFromFirestore(data: any): QCCheckEntity {
    const checklistItems = (data.checklistItems || []).map((item: any) =>
      ChecklistItem.create({
        name: item.name,
        description: item.description,
        isRequired: item.isRequired,
        isPassed: item.isPassed,
        failureReason: item.failureReason,
      })
    );

    const taskSnapshot = TaskSnapshot.create({
      title: data.taskSnapshot.title,
      description: data.taskSnapshot.description,
      quantity: data.taskSnapshot.quantity,
      attachments: data.taskSnapshot.attachments || [],
      completedAt: data.taskSnapshot.completedAt,
      submittedBy: data.taskSnapshot.submittedBy,
    });

    return QCCheckEntity.reconstruct({
      id: data.id,
      taskId: data.taskId,
      workspaceId: data.workspaceId,
      status: data.status as QCStatus,
      checklistItems,
      taskSnapshot,
      reviewer: data.reviewer || null,
      reviewerAssignedAt: data.reviewerAssignedAt || null,
      comments: data.comments || '',
      checkedBy: data.checkedBy || null,
      checkedAt: data.checkedAt || null,
      createdAt: data.createdAt,
    });
  }
}

