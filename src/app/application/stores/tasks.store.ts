/**
 * Tasks Signal Store
 *
 * Layer: Application
 * Purpose: Workspace-scoped task state management
 * Architecture: Zone-less, Signal-based, Pure Reactive, Repository-backed
 *
 * Single Source of Truth for all task data within a workspace.
 * Enforces workspace scope - cleared on workspace switch.
 */

import { computed, inject } from '@angular/core';
import { EVENT_BUS, TASK_REPOSITORY } from '@application/interfaces';
import { IdentityContextStore } from '@application/stores/identity-context.store';
import {
  TaskAggregate,
  TaskPriority,
  TaskStatus,
  createTask,
} from '@domain/aggregates';
import {
  createTaskCreatedEvent,
  createTaskDeletedEvent,
  createTaskUpdatedEvent,
} from '@domain/events';
import { TaskId, WorkspaceId } from '@domain/value-objects';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, exhaustMap, from, pipe, switchMap } from 'rxjs';

// Re-export domain types for presentation layer use
export { TaskAggregate, TaskPriority, TaskStatus, createTask };

/**
 * Tasks State
 */
export interface TasksState {
  readonly tasks: ReadonlyArray<TaskAggregate>;
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  error: null,
};

/**
 * Tasks Store
 *
 * Application-level store for task management using NgRx Signals.
 */
export const TasksStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Tasks by status
     */
    tasksByStatus: computed(
      () => (status: TaskStatus) =>
        state.tasks().filter((t) => t.status === status),
    ),

    /**
     * Blocked tasks
     */
    blockedTasks: computed(() =>
      state.tasks().filter((t) => t.status === 'blocked'),
    ),

    /**
     * Ready tasks
     */
    readyTasks: computed(() =>
      state.tasks().filter((t) => t.status === 'ready'),
    ),

    /**
     * Tasks in QC
     */
    tasksInQC: computed(() =>
      state.tasks().filter((t) => t.status === 'in-qc'),
    ),

    /**
     * Task count
     */
    taskCount: computed(() => state.tasks().length),
  })),

  withMethods((store) => {
    const repo = inject(TASK_REPOSITORY);
    const eventBus = inject(EVENT_BUS);
    const identityContext = inject(IdentityContextStore);

    return {
      /**
       * Load tasks for a workspace
       */
      loadByWorkspace: rxMethod<string>(
        pipe(
          switchMap((workspaceId) => {
            patchState(store, { isLoading: true, error: null });
            return from(
              repo.findByWorkspaceId(WorkspaceId.create(workspaceId)),
            ).pipe(
              tapResponse({
                next: (tasks) =>
                  patchState(store, { tasks, isLoading: false, error: null }),
                error: (err: any) =>
                  patchState(store, { error: err.message, isLoading: false }),
              }),
            );
          }),
        ),
      ),

      /**
       * Add task (saves to repo, updates state, publishes event)
       */
      addTask: rxMethod<TaskAggregate>(
        pipe(
          exhaustMap((task) => {
            patchState(store, { isLoading: true, error: null });
            return from(repo.save(task)).pipe(
              tapResponse({
                next: () => {
                  patchState(store, {
                    tasks: [...store.tasks(), task],
                    isLoading: false,
                    error: null,
                  });
                  // Publish Event
                  eventBus.publish(
                    createTaskCreatedEvent(
                      task.id,
                      task.workspaceId,
                      task.title,
                      task.description,
                      task.priority,
                      task.createdById,
                    ),
                  );
                },
                error: (err: any) =>
                  patchState(store, { error: err.message, isLoading: false }),
              }),
            );
          }),
        ),
      ),

      /**
       * Update task (saves to repo, updates state, publishes event)
       */
      updateTask: rxMethod<{ taskId: string; updates: Partial<TaskAggregate> }>(
        pipe(
          concatMap(({ taskId, updates }) => {
            const task = store.tasks().find((t) => t.id === taskId);
            if (!task) {
              patchState(store, { error: `Task ${taskId} not found` });
              return from([]);
            }

            const updatedTask = { ...task, ...updates, updatedAt: Date.now() };
            patchState(store, { isLoading: true, error: null });

            return from(repo.save(updatedTask)).pipe(
              tapResponse({
                next: () => {
                  patchState(store, {
                    tasks: store
                      .tasks()
                      .map((t) => (t.id === taskId ? updatedTask : t)),
                    isLoading: false,
                    error: null,
                  });

                  const updatedById =
                    identityContext.currentIdentityId() || 'system';

                  // Publish Event
                  eventBus.publish(
                    createTaskUpdatedEvent(
                      task.id,
                      task.workspaceId,
                      updates,
                      updatedById,
                    ),
                  );
                },
                error: (err: any) =>
                  patchState(store, { error: err.message, isLoading: false }),
              }),
            );
          }),
        ),
      ),

      /**
       * Delete Task (deletes from repo, updates state, publishes event)
       */
      deleteTask: rxMethod<string>(
        pipe(
          exhaustMap((taskId) => {
            const task = store.tasks().find((t) => t.id === taskId);
            if (!task) {
              patchState(store, { error: `Task ${taskId} not found` });
              return from([]);
            }

            patchState(store, { isLoading: true, error: null });

            return from(repo.delete(TaskId.create(taskId))).pipe(
              tapResponse({
                next: () => {
                  patchState(store, {
                    tasks: store.tasks().filter((t) => t.id !== taskId),
                    isLoading: false,
                    error: null,
                  });

                  const deletedById =
                    identityContext.currentIdentityId() || 'system';

                  // Publish Event
                  eventBus.publish(
                    createTaskDeletedEvent(
                      taskId,
                      task.workspaceId,
                      deletedById,
                    ),
                  );
                },
                error: (err: any) =>
                  patchState(store, { error: err.message, isLoading: false }),
              }),
            );
          }),
        ),
      ),

      /**
       * Reset (Clear on Workspace Switch)
       */
      reset(): void {
        patchState(store, initialState);
      },

      /**
       * Reset State
       * @deprecated Use reset() instead
       */
      resetState(): void {
        patchState(store, initialState);
      },
    };
  }),
);
