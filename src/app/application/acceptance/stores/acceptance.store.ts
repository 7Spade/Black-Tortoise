/**
 * Acceptance Store
 *
 * Layer: Application - Store
 * Purpose: Manages acceptance workflow state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+, NO RxJS
 *
 * Responsibilities:
 * - Track tasks pending acceptance
 * - Manage approval/rejection decisions
 * - Handle acceptance workflow state
 *
 * Event Integration:
 * - Reacts to: QCPassed (only QC-passed tasks can be accepted)
 * - Publishes: AcceptanceApproved, AcceptanceRejected
 *
 * Clean Architecture Compliance:
 * - Single source of truth for acceptance state
 * - All state updates via patchState
 * - No RxJS subscriptions
 * - Pure signal-based reactivity
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface AcceptanceTask {
  readonly id: string;
  readonly taskId: string;
  readonly taskTitle: string;
  readonly taskDescription: string;
  readonly qcPassedAt: Date;
  readonly qcReviewedBy: string;
  readonly acceptanceStatus: 'pending' | 'approved' | 'rejected';
  readonly decidedAt?: Date;
  readonly decidedBy?: string;
  readonly notes?: string;
}

export interface AcceptanceState {
  readonly tasks: ReadonlyArray<AcceptanceTask>;
  readonly selectedTaskId: string | null;
  readonly isProcessing: boolean;
  readonly error: string | null;
}

const initialState: AcceptanceState = {
  tasks: [],
  selectedTaskId: null,
  isProcessing: false,
  error: null,
};

/**
 * Acceptance Store
 *
 * Application-level store for acceptance management using NgRx Signals.
 */
export const AcceptanceStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Pending acceptance tasks
     */
    pendingTasks: computed(() =>
      state.tasks().filter(t => t.acceptanceStatus === 'pending')
    ),

    /**
     * Approved tasks
     */
    approvedTasks: computed(() =>
      state.tasks().filter(t => t.acceptanceStatus === 'approved')
    ),

    /**
     * Rejected tasks
     */
    rejectedTasks: computed(() =>
      state.tasks().filter(t => t.acceptanceStatus === 'rejected')
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
    hasPendingTasks: computed(() => state.tasks().some(t => t.acceptanceStatus === 'pending')),
  })),

  withMethods((store) => ({
    /**
     * Add task for acceptance review
     */
    addTaskForAcceptance(task: Omit<AcceptanceTask, 'id' | 'acceptanceStatus'>): void {
      const acceptanceTask: AcceptanceTask = {
        ...task,
        id: crypto.randomUUID(),
        acceptanceStatus: 'pending',
      };

      patchState(store, {
        tasks: [...store.tasks(), acceptanceTask],
      });
    },

    /**
     * Approve task
     */
    approveTask(taskId: string, approvedBy: string, notes?: string): void {
      const updatedTasks = store.tasks().map(t =>
        t.taskId === taskId
          ? { ...t, acceptanceStatus: 'approved' as const, decidedAt: new Date(), decidedBy: approvedBy, notes }
          : t
      );

      patchState(store, {
        tasks: updatedTasks as ReadonlyArray<AcceptanceTask>,
        isProcessing: false,
      });
    },

    /**
     * Reject task
     */
    rejectTask(taskId: string, rejectedBy: string, notes: string): void {
      const updatedTasks = store.tasks().map(t =>
        t.taskId === taskId
          ? { ...t, acceptanceStatus: 'rejected' as const, decidedAt: new Date(), decidedBy: rejectedBy, notes }
          : t
      );

      patchState(store, {
        tasks: updatedTasks as ReadonlyArray<AcceptanceTask>,
        isProcessing: false,
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
        isProcessing: false,
        error: null,
      });
    },

    /**
     * Set error
     */
    setError(error: string | null): void {
      patchState(store, { error, isProcessing: false });
    },
  }))
);
