/**
 * Tasks Signal Store
 * 
 * Layer: Application
 * Purpose: Workspace-scoped task state management
 * Architecture: Zone-less, Signal-based, Pure Reactive
 * 
 * Single Source of Truth for all task data within a workspace.
 * Enforces workspace scope - no global access.
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { TaskEntity, TaskStatus } from '@domain/task/task.entity';

/**
 * Tasks State
 */
export interface TasksState {
  readonly workspaceId: string;
  readonly tasks: ReadonlyMap<string, TaskEntity>;
  readonly isLoading: boolean;
  readonly error: string | null;
}

/**
 * Create workspace-scoped Tasks Store
 * 
 * IMPORTANT: This store is workspace-scoped, not global.
 * Each workspace runtime creates its own instance.
 */
export function createTasksStore(workspaceId: string) {
  const initialState: TasksState = {
    workspaceId,
    tasks: new Map(),
    isLoading: false,
    error: null,
  };

  return signalStore(
    withState(initialState),

    withComputed((state) => ({
      /**
       * All tasks as array
       */
      tasksList: computed(() => Array.from(state.tasks().values())),

      /**
       * Tasks by status
       */
      tasksByStatus: computed(() => (status: TaskStatus) =>
        Array.from(state.tasks().values()).filter(t => t.status === status)
      ),

      /**
       * Blocked tasks
       */
      blockedTasks: computed(() =>
        Array.from(state.tasks().values()).filter(t => t.status === 'blocked')
      ),

      /**
       * Tasks ready for work
       */
      readyTasks: computed(() =>
        Array.from(state.tasks().values()).filter(t => t.status === 'ready')
      ),

      /**
       * Tasks in QC
       */
      tasksInQC: computed(() =>
        Array.from(state.tasks().values()).filter(t => t.status === 'in-qc')
      ),

      /**
       * Task count
       */
      taskCount: computed(() => state.tasks().size),
    })),

    withMethods((store) => ({
      /**
       * Add task to store
       */
      addTask(task: TaskEntity): void {
        if (task.workspaceId !== store.workspaceId()) {
          console.error('[TasksStore] Task workspace mismatch', {
            expected: store.workspaceId(),
            received: task.workspaceId,
          });
          return;
        }

        const newTasks = new Map(store.tasks());
        newTasks.set(task.id, task);

        patchState(store, {
          tasks: newTasks,
          error: null,
        });
      },

      /**
       * Update task
       */
      updateTask(taskId: string, updates: Partial<TaskEntity>): void {
        const task = store.tasks().get(taskId);
        if (!task) {
          patchState(store, { error: `Task ${taskId} not found` });
          return;
        }

        const updatedTask = { ...task, ...updates, updatedAt: new Date() };
        const newTasks = new Map(store.tasks());
        newTasks.set(taskId, updatedTask);

        patchState(store, {
          tasks: newTasks,
          error: null,
        });
      },

      /**
       * Remove task
       */
      removeTask(taskId: string): void {
        const newTasks = new Map(store.tasks());
        newTasks.delete(taskId);

        patchState(store, {
          tasks: newTasks,
          error: null,
        });
      },

      /**
       * Get task by ID
       */
      getTask(taskId: string): TaskEntity | undefined {
        return store.tasks().get(taskId);
      },

      /**
       * Set loading state
       */
      setLoading(isLoading: boolean): void {
        patchState(store, { isLoading });
      },

      /**
       * Set error
       */
      setError(error: string | null): void {
        patchState(store, { error });
      },

      /**
       * Clear all tasks
       */
      clearTasks(): void {
        patchState(store, {
          tasks: new Map(),
          error: null,
        });
      },
    }))
  );
}

/**
 * Tasks Store Type
 */
export type TasksStore = ReturnType<typeof createTasksStore>;
