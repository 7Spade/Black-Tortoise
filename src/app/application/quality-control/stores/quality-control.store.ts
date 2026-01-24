/**
 * Quality Control Store
 *
 * Layer: Application - Store
 * Purpose: Manages QC state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - QC review queue management
 * - QC status tracking
 * - Event-driven integration with Tasks module
 *
 * Event Flow:
 * - Listens: TaskSubmittedForQC
 * - Publishes: QCPassed, QCFailed
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

import { EventBus } from '@domain/event-bus/event-bus.interface';
import { EventStore } from '@domain/event-store/event-store.interface';
import { createQCPassedEvent, createQCFailedEvent } from '@domain/events/domain-events';

export interface QCReviewItem {
  readonly taskId: string;
  readonly taskTitle: string;
  readonly taskDescription: string;
  readonly submittedById: string;
  readonly submittedAt: Date;
  readonly status: 'pending' | 'reviewing' | 'passed' | 'failed';
  readonly reviewerId?: string;
  readonly reviewNotes?: string;
  readonly failureReason?: string;
}

export interface QualityControlState {
  readonly reviewQueue: ReadonlyArray<QCReviewItem>;
  readonly currentReview: QCReviewItem | null;
  readonly completedReviews: ReadonlyArray<QCReviewItem>;
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: QualityControlState = {
  reviewQueue: [],
  currentReview: null,
  completedReviews: [],
  isLoading: false,
  error: null,
};

export const QualityControlStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    pendingCount: computed(() => 
      state.reviewQueue().filter(item => item.status === 'pending').length
    ),
    
    reviewingCount: computed(() =>
      state.reviewQueue().filter(item => item.status === 'reviewing').length
    ),
    
    hasItemsToReview: computed(() => state.reviewQueue().length > 0),
    
    passedCount: computed(() =>
      state.completedReviews().filter(item => item.status === 'passed').length
    ),
    
    failedCount: computed(() =>
      state.completedReviews().filter(item => item.status === 'failed').length
    ),
  })),

  withMethods((store) => ({
    /**
     * Add task to review queue
     * Called when TaskSubmittedForQC event is received
     */
    addToQueue(taskId: string, taskTitle: string, taskDescription: string, submittedById: string): void {
      const newItem: QCReviewItem = {
        taskId,
        taskTitle,
        taskDescription,
        submittedById,
        submittedAt: new Date(),
        status: 'pending',
      };
      
      patchState(store, {
        reviewQueue: [...store.reviewQueue(), newItem],
        error: null,
      });
    },

    /**
     * Start reviewing a task
     */
    startReview(taskId: string, reviewerId: string): void {
      const queue = store.reviewQueue();
      const item = queue.find(i => i.taskId === taskId);
      
      if (!item) {
        patchState(store, { error: `Task ${taskId} not found in queue` });
        return;
      }
      
      const updatedItem: QCReviewItem = { ...item, status: 'reviewing', reviewerId };
      
      patchState(store, {
        reviewQueue: queue.map(i => i.taskId === taskId ? updatedItem : i),
        currentReview: updatedItem,
        error: null,
      });
    },

    /**
     * Pass QC review
     */
    passReview: rxMethod<{
      taskId: string;
      reviewerId: string;
      reviewNotes?: string;
      workspaceId: string;
      eventBus: EventBus;
      eventStore: EventStore;
    }>(
      pipe(
        tap(({ taskId, reviewerId, reviewNotes, workspaceId, eventBus, eventStore }) => {
          const queue = store.reviewQueue();
          const item = queue.find(i => i.taskId === taskId);
          
          if (!item) {
            patchState(store, { error: `Task ${taskId} not found` });
            return;
          }
          
          const completedItem: QCReviewItem = {
            ...item,
            status: 'passed',
            reviewerId,
            reviewNotes,
          };
          
          // Create and publish event
          const event = createQCPassedEvent(
            taskId,
            workspaceId,
            item.taskTitle,
            reviewerId,
            reviewNotes
          );
          
          // Append then publish
          eventStore.append(event).then(() => {
            eventBus.publish(event);
          });
          
          // Update state
          patchState(store, {
            reviewQueue: queue.filter(i => i.taskId !== taskId),
            currentReview: null,
            completedReviews: [...store.completedReviews(), completedItem],
            error: null,
          });
        })
      )
    ),

    /**
     * Fail QC review
     */
    failReview: rxMethod<{
      taskId: string;
      reviewerId: string;
      failureReason: string;
      workspaceId: string;
      eventBus: EventBus;
      eventStore: EventStore;
    }>(
      pipe(
        tap(({ taskId, reviewerId, failureReason, workspaceId, eventBus, eventStore }) => {
          const queue = store.reviewQueue();
          const item = queue.find(i => i.taskId === taskId);
          
          if (!item) {
            patchState(store, { error: `Task ${taskId} not found` });
            return;
          }
          
          const completedItem: QCReviewItem = {
            ...item,
            status: 'failed',
            reviewerId,
            failureReason,
          };
          
          // Create and publish event
          const event = createQCFailedEvent(
            taskId,
            workspaceId,
            item.taskTitle,
            failureReason,
            reviewerId
          );
          
          // Append then publish
          eventStore.append(event).then(() => {
            eventBus.publish(event);
          });
          
          // Update state
          patchState(store, {
            reviewQueue: queue.filter(i => i.taskId !== taskId),
            currentReview: null,
            completedReviews: [...store.completedReviews(), completedItem],
            error: null,
          });
        })
      )
    ),

    /**
     * Clear completed reviews
     */
    clearCompleted(): void {
      patchState(store, { completedReviews: [] });
    },

    /**
     * Reset store (on workspace switch)
     */
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
