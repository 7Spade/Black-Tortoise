/**
 * Acceptance Store
 *
 * Layer: Application - Store
 * Purpose: Manages acceptance testing state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Acceptance queue management
 * - Checklist validation
 * - Event-driven integration with QC and Tasks modules
 *
 * Event Flow:
 * - Listens: QCPassed
 * - Publishes: AcceptancePassed, AcceptanceFailed
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

import { EventBus } from '@domain/event-bus/event-bus.interface';
import { EventStore } from '@domain/event-store/event-store.interface';
import { createAcceptancePassedEvent, createAcceptanceFailedEvent } from '@domain/events/domain-events';

export interface AcceptanceItem {
  readonly taskId: string;
  readonly taskTitle: string;
  readonly taskDescription: string;
  readonly checklistItems: string[];
  readonly completedItems: string[];
  readonly submittedAt: Date;
  readonly status: 'pending' | 'reviewing' | 'passed' | 'failed';
  readonly acceptedById?: string;
  readonly acceptanceNotes?: string;
  readonly failureReason?: string;
  readonly failedItems?: string[];
}

export interface AcceptanceState {
  readonly acceptanceQueue: ReadonlyArray<AcceptanceItem>;
  readonly currentReview: AcceptanceItem | null;
  readonly completedAcceptances: ReadonlyArray<AcceptanceItem>;
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: AcceptanceState = {
  acceptanceQueue: [],
  currentReview: null,
  completedAcceptances: [],
  isLoading: false,
  error: null,
};

export const AcceptanceStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    pendingCount: computed(() =>
      state.acceptanceQueue().filter(item => item.status === 'pending').length
    ),
    
    reviewingCount: computed(() =>
      state.acceptanceQueue().filter(item => item.status === 'reviewing').length
    ),
    
    hasItemsToReview: computed(() => state.acceptanceQueue().length > 0),
    
    passedCount: computed(() =>
      state.completedAcceptances().filter(item => item.status === 'passed').length
    ),
    
    failedCount: computed(() =>
      state.completedAcceptances().filter(item => item.status === 'failed').length
    ),
  })),

  withMethods((store) => ({
    /**
     * Add task to acceptance queue
     * Called when QCPassed event is received
     */
    addToQueue(
      taskId: string,
      taskTitle: string,
      taskDescription: string,
      checklistItems: string[]
    ): void {
      const newItem: AcceptanceItem = {
        taskId,
        taskTitle,
        taskDescription,
        checklistItems,
        completedItems: [],
        submittedAt: new Date(),
        status: 'pending',
      };
      
      patchState(store, {
        acceptanceQueue: [...store.acceptanceQueue(), newItem],
        error: null,
      });
    },

    /**
     * Start acceptance review
     */
    startReview(taskId: string): void {
      const queue = store.acceptanceQueue();
      const item = queue.find(i => i.taskId === taskId);
      
      if (!item) {
        patchState(store, { error: `Task ${taskId} not found in queue` });
        return;
      }
      
      const updatedItem: AcceptanceItem = { ...item, status: 'reviewing' };
      
      patchState(store, {
        acceptanceQueue: queue.map(i => i.taskId === taskId ? updatedItem : i),
        currentReview: updatedItem,
        error: null,
      });
    },

    /**
     * Update checklist item completion
     */
    toggleChecklistItem(taskId: string, item: string): void {
      const currentReview = store.currentReview();
      
      if (!currentReview || currentReview.taskId !== taskId) {
        return;
      }
      
      const completedItems = currentReview.completedItems.includes(item)
        ? currentReview.completedItems.filter(i => i !== item)
        : [...currentReview.completedItems, item];
      
      const updatedReview: AcceptanceItem = { ...currentReview, completedItems };
      
      patchState(store, {
        currentReview: updatedReview,
        acceptanceQueue: store.acceptanceQueue().map(i =>
          i.taskId === taskId ? updatedReview : i
        ),
      });
    },

    /**
     * Pass acceptance review
     */
    passReview: rxMethod<{
      taskId: string;
      acceptedById: string;
      acceptanceNotes?: string;
      workspaceId: string;
      eventBus: EventBus;
      eventStore: EventStore;
    }>(
      pipe(
        tap(({ taskId, acceptedById, acceptanceNotes, workspaceId, eventBus, eventStore }) => {
          const queue = store.acceptanceQueue();
          const item = queue.find(i => i.taskId === taskId);
          
          if (!item) {
            patchState(store, { error: `Task ${taskId} not found` });
            return;
          }
          
          const completedItem: AcceptanceItem = {
            ...item,
            status: 'passed',
            acceptedById,
            acceptanceNotes,
          };
          
          // Create and publish event
          const event = createAcceptancePassedEvent(
            taskId,
            workspaceId,
            item.taskTitle,
            acceptedById,
            acceptanceNotes,
            item.completedItems
          );
          
          // Append then publish
          eventStore.append(event).then(() => {
            eventBus.publish(event);
          });
          
          // Update state
          patchState(store, {
            acceptanceQueue: queue.filter(i => i.taskId !== taskId),
            currentReview: null,
            completedAcceptances: [...store.completedAcceptances(), completedItem],
            error: null,
          });
        })
      )
    ),

    /**
     * Fail acceptance review
     */
    failReview: rxMethod<{
      taskId: string;
      rejectedById: string;
      failureReason: string;
      failedItems: string[];
      workspaceId: string;
      eventBus: EventBus;
      eventStore: EventStore;
    }>(
      pipe(
        tap(({ taskId, rejectedById, failureReason, failedItems, workspaceId, eventBus, eventStore }) => {
          const queue = store.acceptanceQueue();
          const item = queue.find(i => i.taskId === taskId);
          
          if (!item) {
            patchState(store, { error: `Task ${taskId} not found` });
            return;
          }
          
          const completedItem: AcceptanceItem = {
            ...item,
            status: 'failed',
            acceptedById: rejectedById,
            failureReason,
            failedItems,
          };
          
          // Create and publish event
          const event = createAcceptanceFailedEvent(
            taskId,
            workspaceId,
            item.taskTitle,
            rejectedById,
            failureReason,
            failedItems
          );
          
          // Append then publish
          eventStore.append(event).then(() => {
            eventBus.publish(event);
          });
          
          // Update state
          patchState(store, {
            acceptanceQueue: queue.filter(i => i.taskId !== taskId),
            currentReview: null,
            completedAcceptances: [...store.completedAcceptances(), completedItem],
            error: null,
          });
        })
      )
    ),

    /**
     * Clear completed acceptances
     */
    clearCompleted(): void {
      patchState(store, { completedAcceptances: [] });
    },

    /**
     * Reset store (on workspace switch)
     */
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
