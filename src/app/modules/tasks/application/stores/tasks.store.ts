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
import { TASK_REPOSITORY } from '@tasks/application/interfaces/task-repository.token';
import {
  TaskAggregate,
  TaskPriority,
  TaskProps,
  TaskStatus,
  TaskStatusEnum,
  createTask,
} from '@tasks/domain';
import { WorkspaceId } from '@domain/value-objects';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { from, pipe, switchMap } from 'rxjs';

// Re-export domain types for presentation layer use
export {
  TaskAggregate,
  TaskPriority,
  TaskProps,
  TaskStatus,
  TaskStatusEnum,
  createTask,
};

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
        state.tasks().filter((t) => t.status.value === status.value),
    ),

    /**
     * Blocked tasks
     */
    blockedTasks: computed(() =>
      state
        .tasks()
        .filter((t) => t.status.value === TaskStatusEnum.BLOCKED),
    ),

    /**
     * Ready tasks
     */
    readyTasks: computed(() =>
      state.tasks().filter((t) => t.status.value === TaskStatusEnum.READY),
    ),

    /**
     * Tasks in QC
     */
    tasksInQC: computed(() =>
      state.tasks().filter((t) => t.status.value === TaskStatusEnum.IN_QC),
    ),

    /**
     * Task count
     */
    taskCount: computed(() => state.tasks().length),
  })),

  withMethods((store) => {
    const repo = inject(TASK_REPOSITORY);

    return {
      /**
       * Load tasks for a workspace (Query Side)
       */
      loadByWorkspace: rxMethod<string>(
        pipe(
          switchMap((workspaceId) => {
            patchState(store, { isLoading: true, error: null });
            return from(repo.findByWorkspace(workspaceId)).pipe(
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
       * Add task to local state (Reactive Update)
       * Triggered by: EventBus (TaskCreated)
       */
      addTask(task: TaskAggregate): void {
        patchState(store, {
          tasks: [...store.tasks(), task],
          error: null,
        });
      },

      /**
       * Update task in local state (Reactive Update)
       * Triggered by: EventBus (TaskUpdated, etc.)
       */
      updateTask(taskId: string, updates: Partial<TaskProps>): void {
        const task = store.tasks().find((t) => t.id.value === taskId);
        if (!task) return;

        const updatedTask = task.cloneWith(updates);

        patchState(store, {
          tasks: store
            .tasks()
            .map((t) => (t.id.value === taskId ? updatedTask : t)),
          error: null,
        });
      },

      /**
       * Sync an existing task aggregate into the state (Reactive Update)
       */
      syncTask(updatedTask: TaskAggregate): void {
        patchState(store, {
          tasks: store
            .tasks()
            .map((t) =>
              t.id.value === updatedTask.id.value ? updatedTask : t,
            ),
          error: null,
        });
      },

      /**
       * Delete Task from local state (Reactive Update)
       * Triggered by: EventBus (TaskDeleted)
       */
      deleteTask(taskId: string): void {
        patchState(store, {
          tasks: store.tasks().filter((t) => t.id.value !== taskId),
          error: null,
        });
      },

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
