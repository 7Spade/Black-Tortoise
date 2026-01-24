/**
 * Quality Control Store
 *
 * Layer: Application - Store
 * Purpose: Manages QC review state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+, NO RxJS
 *
 * Responsibilities:
 * - Track tasks pending QC review
 * - Manage review decisions (pass/fail)
 * - Handle QC workflow state
 *
 * Event Integration:
 * - Reacts to: TaskSubmittedForQC
 * - Publishes: QCPassed, QCFailed
 *
 * Clean Architecture Compliance:
 * - Single source of truth for QC state
 * - All state updates via patchState
 * - No RxJS subscriptions
 * - Pure signal-based reactivity
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface QCTask {
  readonly id: string;
  readonly taskId: string;
  readonly taskTitle: string;
  readonly taskDescription: string;
  readonly submittedAt: Date;
  readonly submittedBy: string;
  readonly reviewStatus: 'pending' | 'passed' | 'failed';
  readonly reviewedAt?: Date;
  readonly reviewedBy?: string;
  readonly reviewNotes?: string;
}

export interface QualityControlState {
  readonly tasks: ReadonlyArray<QCTask>;
  readonly selectedTaskId: string | null;
  readonly isReviewing: boolean;
  readonly error: string | null;
}

const initialState: QualityControlState = {
  tasks: [],
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
     * Completed reviews
     */
    completedReviews: computed(() =>
      state.tasks().filter(t => t.reviewStatus !== 'pending')
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
     * Select task for review
     */
    selectTask(taskId: string | null): void {
      patchState(store, { selectedTaskId: taskId });
    },

    /**
     * Clear all tasks (workspace switch)
     */
    clearTasks(): void {
      patchState(store, {
        tasks: [],
        selectedTaskId: null,
        isReviewing: false,
        error: null,
      });
    },

    /**
     * Set error
     */
    setError(error: string | null): void {
      patchState(store, { error, isReviewing: false });
    },
  }))
);
