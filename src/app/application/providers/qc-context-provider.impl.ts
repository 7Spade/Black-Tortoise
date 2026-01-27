/**
 * QC Context Provider Implementation
 *
 * Layer: Application - Providers
 * Purpose: Implementation of QCContextProvider using QualityControlStore
 */

import { inject, Injectable } from '@angular/core';
import { QualityControlStore } from '../stores/quality-control.store';
import { QCContextProvider } from './qc-context.provider';
import { QCCriteriaPolicy } from '@domain/policies/qc-criteria.policy';

@Injectable({ providedIn: 'root' })
export class QCContextProviderImpl extends QCContextProvider {
  private readonly qcStore = inject(QualityControlStore);

  getQCStatus(taskId: string): string | null {
    const task = this.qcStore.tasks().find(t => t.taskId === taskId);
    return task?.reviewStatus || null;
  }

  canStartQC(taskId: string): boolean {
    return this.qcStore.canStartQC(taskId);
  }

  hasPassedQC(taskId: string): boolean {
    const task = this.qcStore.tasks().find(t => t.taskId === taskId);
    return task?.reviewStatus === 'passed';
  }

  getQCReviewer(taskId: string): string | null {
    const task = this.qcStore.tasks().find(t => t.taskId === taskId);
    return task?.reviewer || task?.reviewedBy || null;
  }

  getChecklistCompletion(taskId: string): number {
    const task = this.qcStore.tasks().find(t => t.taskId === taskId);
    if (!task || !task.checklistItems) return 0;
    
    return QCCriteriaPolicy.getCompletionPercentage(task.checklistItems);
  }
}
