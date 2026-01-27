/**
 * Quality Control Store
 *
 * Layer: Application - Store
 * Purpose: Manages QC review state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+, NO RxJS
 *
 * Responsibilities:
 * - Track tasks pending QC review
 * - Manage checklist items and templates
 * - Handle QC workflow state with analytics
 * - Track issue resolutions for QC restart
 *
 * Event Integration:
 * - Reacts to: TaskReadyForQC, IssueResolved
 * - Publishes: QCStarted, QCPassed, QCFailed
 *
 * Clean Architecture Compliance:
 * - Single source of truth for QC state
 * - All state updates via patchState
 * - No RxJS subscriptions
 * - Pure signal-based reactivity
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import type { QCTemplate } from '@domain/value-objects/qc-template.vo';
import type { ChecklistItem } from '@domain/value-objects/checklist-item.vo';

export interface QCTask {
  readonly id: string;
  readonly taskId: string;
  readonly taskTitle: string;
  readonly taskDescription: string;
  readonly taskType: string;
  readonly submittedAt: Date;
  readonly submittedBy: string;
  readonly reviewStatus: 'pending' | 'in_progress' | 'passed' | 'failed';
  readonly checklistItems: ReadonlyArray<ChecklistItem>;
  readonly reviewedAt?: Date;
  readonly reviewedBy?: string;
  readonly reviewNotes?: string;
  readonly reviewer?: string;
  readonly reviewStartedAt?: Date;
}

export interface QualityControlState {
  readonly tasks: ReadonlyArray<QCTask>;
  readonly checklistTemplates: ReadonlyMap<string, QCTemplate>;
  readonly issueResolutions: ReadonlyMap<string, number>; // taskId -> resolvedAt
  readonly selectedTaskId: string | null;
  readonly isReviewing: boolean;
  readonly error: string | null;
}

const initialState: QualityControlState = {
  tasks: [],
  checklistTemplates: new Map(),
  issueResolutions: new Map(),
  selectedTaskId: null,
  isReviewing: false,
  error: null,
};

/**
 * Quality Control Store
 *
 * Application-level store for QC management using NgRx Signals.
 */
export const QualityControlStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Pending QC tasks
     */
    pendingTasks: computed(() =>
      state.tasks().filter(t => t.reviewStatus === 'pending')
    ),

    /**
     * In-progress QC tasks
     */
    inProgressTasks: computed(() =>
      state.tasks().filter(t => t.reviewStatus === 'in_progress')
    ),

    /**
     * Completed reviews
     */
    completedReviews: computed(() =>
      state.tasks().filter(t => t.reviewStatus === 'passed' || t.reviewStatus === 'failed')
    ),

    /**
     * Selected task
     */
    selectedTask: computed(() => {
      const id = state.selectedTaskId();
      return id ? state.tasks().find(t => t.id === id) || null : null;
    }),

    /**
     * Has pending tasks
     */
    hasPendingTasks: computed(() => state.tasks().some(t => t.reviewStatus === 'pending')),

    /**
     * QC pass rate (analytics)
     */
    passRate: computed(() => {
      const completed = state.tasks().filter(t => t.reviewStatus === 'passed' || t.reviewStatus === 'failed');
      if (completed.length === 0) return 0;
      const passed = completed.filter(t => t.reviewStatus === 'passed').length;
      return Math.round((passed / completed.length) * 100);
    }),

    /**
     * Average QC time in hours (analytics)
     */
    averageQCTime: computed(() => {
      const completed = state.tasks().filter(t => t.reviewStatus !== 'pending' && t.reviewedAt);
      if (completed.length === 0) return 0;
      
      const totalHours = completed.reduce((sum, task) => {
        if (!task.reviewedAt) return sum;
        const hours = (task.reviewedAt.getTime() - task.submittedAt.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);
      
      return Math.round(totalHours / completed.length * 10) / 10;
    }),

    /**
     * Failure type distribution (analytics)
     */
    failureTypeDistribution: computed(() => {
      const failed = state.tasks().filter(t => t.reviewStatus === 'failed');
      const distribution = new Map<string, number>();
      
      failed.forEach(task => {
        if (task.reviewNotes) {
          const key = task.reviewNotes.substring(0, 50); // Truncate for grouping
          distribution.set(key, (distribution.get(key) || 0) + 1);
        }
      });
      
      return distribution;
    }),

    /**
     * Reviewer workload (analytics)
     */
    reviewerWorkload: computed(() => {
      const workload = new Map<string, number>();
      
      state.tasks().forEach(task => {
        if (task.reviewedBy) {
          workload.set(task.reviewedBy, (workload.get(task.reviewedBy) || 0) + 1);
        }
      });
      
      return workload;
    }),
  })),

  withMethods((store) => ({
    /**
     * Add task for QC review
     */
    addTaskForReview(task: Omit<QCTask, 'id' | 'reviewStatus'>): void {
      const qcTask: QCTask = {
        ...task,
        id: crypto.randomUUID(),
        reviewStatus: 'pending',
      };

      patchState(store, {
        tasks: [...store.tasks(), qcTask],
      });
    },

    /**
     * Start QC review (assign reviewer)
     */
    startReview(taskId: string, reviewerId: string): void {
      const updatedTasks = store.tasks().map(t =>
        t.taskId === taskId
          ? { ...t, reviewStatus: 'in_progress' as const, reviewer: reviewerId, reviewStartedAt: new Date() }
          : t
      );

      patchState(store, {
        tasks: updatedTasks as ReadonlyArray<QCTask>,
        isReviewing: true,
        selectedTaskId: taskId,
      });
    },

    /**
     * Update checklist item
     */
    updateChecklistItem(qcId: string, itemIndex: number, isPassed: boolean, failureReason?: string): void {
      const updatedTasks = store.tasks().map(t => {
        if (t.id !== qcId) return t;
        
        const updatedItems = t.checklistItems.map((item, idx) => {
          if (idx !== itemIndex) return item;
          return isPassed ? item.markPassed() : item.markFailed(failureReason || '');
        });
        
        return { ...t, checklistItems: updatedItems as ReadonlyArray<ChecklistItem> };
      });

      patchState(store, {
        tasks: updatedTasks as ReadonlyArray<QCTask>,
      });
    },

    /**
     * Check if QC can pass (all required items passed)
     */
    canPassQC(qcId: string): boolean {
      const task = store.tasks().find(t => t.id === qcId);
      if (!task) return false;

      const requiredItems = task.checklistItems.filter(item => item.isRequired);
      return requiredItems.every(item => item.isPassed === true);
    },

    /**
     * Mark task as passed
     */
    passTask(taskId: string, reviewedBy: string, reviewNotes?: string): void {
      const updatedTasks = store.tasks().map(t =>
        t.taskId === taskId
          ? { ...t, reviewStatus: 'passed' as const, reviewedAt: new Date(), reviewedBy, reviewNotes }
          : t
      );

      patchState(store, {
        tasks: updatedTasks as ReadonlyArray<QCTask>,
        isReviewing: false,
      });
    },

    /**
     * Mark task as failed
     */
    failTask(taskId: string, reviewedBy: string, reviewNotes: string): void {
      const updatedTasks = store.tasks().map(t =>
        t.taskId === taskId
          ? { ...t, reviewStatus: 'failed' as const, reviewedAt: new Date(), reviewedBy, reviewNotes }
          : t
      );

      patchState(store, {
        tasks: updatedTasks as ReadonlyArray<QCTask>,
        isReviewing: false,
      });
    },

    /**
     * Restart QC after issue resolved
     */
    restartQCAfterIssueResolved(taskId: string): void {
      const now = Date.now();
      const updatedTasks = store.tasks().map(t =>
        t.taskId === taskId
          ? { ...t, reviewStatus: 'pending' as const, reviewedAt: undefined, reviewedBy: undefined, reviewNotes: undefined }
          : t
      );

      const newResolutions = new Map(store.issueResolutions());
      newResolutions.set(taskId, now);

      patchState(store, {
        tasks: updatedTasks as ReadonlyArray<QCTask>,
        issueResolutions: newResolutions,
      });
    },

    /**
     * Load template
     */
    loadTemplate(taskType: string, template: QCTemplate): void {
      const newTemplates = new Map(store.checklistTemplates());
      newTemplates.set(taskType, template);

      patchState(store, {
        checklistTemplates: newTemplates,
      });
    },

    /**
     * Check if task can start QC
     */
    canStartQC(taskId: string): boolean {
      const existingQC = store.tasks().find(t => t.taskId === taskId && t.reviewStatus === 'pending');
      return !!existingQC;
    },

    /**
     * Select task for review
     */
    selectTask(taskId: string | null): void {
      patchState(store, { selectedTaskId: taskId });
    },

    /**
     * Reset (Clear on Workspace Switch)
     */
    reset(): void {
      patchState(store, initialState);
    },

    /**
     * Clear all tasks (workspace switch)
     * @deprecated Use reset() instead
     */
    clearTasks(): void {
      this.reset();
    },

    /**
     * Set error
     */
    setError(error: string | null): void {
      patchState(store, { error, isReviewing: false });
    },
  }))
);

