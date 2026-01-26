/**
 * Acceptance Store
 *
 * Layer: Application - Store
 * Purpose: Manages acceptance workflow state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+, Event-Driven
 *
 * Responsibilities:
 * - Track tasks pending acceptance
 * - React to AcceptanceApproved/AcceptanceRejected/QCPassed events
 * - All state changes via event handlers ONLY
 *
 * Event Integration:
 * - Reacts to: QCPassed, AcceptanceApproved, AcceptanceRejected
 * - State mutations ONLY in event handlers
 * - Event handlers are registered by workspace runtime/event orchestrator
 *
 * Clean Architecture Compliance:
 * - Single source of truth for acceptance state
 * - All state updates via patchState in event handlers
 * - Event-driven architecture (append ??publish ??react)
 * - Pure signal-based reactivity
 */

import { computed } from '@angular/core';
import { AcceptanceApprovedEvent } from '@domain/events';
import { AcceptanceRejectedEvent } from '@domain/events';
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
     * Add task for acceptance review (from QCPassed event)
     * Called by event handler ONLY
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
     * Handle AcceptanceApproved event
     * Event handler - mutates state in response to event
     */
    handleAcceptanceApproved(event: AcceptanceApprovedEvent): void {
      const updatedTasks = store.tasks().map(t =>
        t.taskId === event.payload.taskId
          ? { 
              ...t, 
              acceptanceStatus: 'approved' as const, 
              decidedAt: event.timestamp, 
              decidedBy: event.payload.approverId, 
              notes: event.payload.approvalNotes 
            }
          : t
      );

      patchState(store, {
        tasks: updatedTasks as ReadonlyArray<AcceptanceTask>,
        isProcessing: false,
      });
    },

    /**
     * Handle AcceptanceRejected event
     * Event handler - mutates state in response to event
     */
    handleAcceptanceRejected(event: AcceptanceRejectedEvent): void {
      const updatedTasks = store.tasks().map(t =>
        t.taskId === event.payload.taskId
          ? { 
              ...t, 
              acceptanceStatus: 'rejected' as const, 
              decidedAt: event.timestamp, 
              decidedBy: event.payload.rejectedById, 
              notes: event.payload.rejectionReason 
            }
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


