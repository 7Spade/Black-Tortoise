/**
 * Tasks Signal Store
 * 
 * Layer: Application
 * Purpose: Workspace-scoped task state management
 * Architecture: Zone-less, Signal-based, Pure Reactive
 * 
 * Single Source of Truth for all task data within a workspace.
 * Enforces workspace scope - cleared on workspace switch.
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { TaskEntity, TaskStatus } from '@domain/task/task.entity';

/**
 * Tasks State
 */
export interface TasksState {
  readonly tasks: ReadonlyArray<TaskEntity>;
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
    tasksByStatus: computed(() => (status: TaskStatus) =>
      state.tasks().filter(t => t.status === status)
    ),

    /**
     * Blocked tasks
     */
    blockedTasks: computed(() =>
      state.tasks().filter(t => t.status === 'blocked')
    ),

    /**
     * Ready tasks
     */
    readyTasks: computed(() =>
      state.tasks().filter(t => t.status === 'ready')
    ),

    /**
     * Tasks in QC
     */
    tasksInQC: computed(() =>
      state.tasks().filter(t => t.status === 'in-qc')
    ),

    /**
     * Task count
     */
    taskCount: computed(() => state.tasks().length),
  })),

  withMethods((store) => ({
    /**
     * Add task to store
     */
    addTask(task: TaskEntity): void {
      patchState(store, {
        tasks: [...store.tasks(), task],
        error: null,
      });
    },

    /**
     * Update task
     */
    updateTask(taskId: string, updates: Partial<TaskEntity>): void {
      const task = store.tasks().find(t => t.id === taskId);
      if (!task) {
        patchState(store, { error: `Task ${taskId} not found` });
        return;
      }

      const updatedTask = { ...task, ...updates, updatedAt: new Date() };
      
      patchState(store, {
        tasks: store.tasks().map(t => t.id === taskId ? updatedTask : t),
        error: null,
      });
    },

    /**
     * Remove task
     */
    removeTask(taskId: string): void {
      patchState(store, {
        tasks: store.tasks().filter(t => t.id !== taskId),
        error: null,
      });
    },

    /**
     * Get task by ID
     */
    getTask(taskId: string): TaskEntity | undefined {
      return store.tasks().find(t => t.id === taskId);
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
     * Clear all tasks (workspace switch)
     */
    clearTasks(): void {
      patchState(store, {
        tasks: [],
        error: null,
      });
    },
  }))
);
