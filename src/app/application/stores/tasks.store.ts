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
import { TaskAggregate, TaskStatus } from '@domain/aggregates';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { TASK_REPOSITORY } from '@application/interfaces';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { WorkspaceId, TaskId } from '@domain/value-objects';
import { from } from 'rxjs';

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

  withMethods((store, repo = inject(TASK_REPOSITORY)) => ({

    /**
     * Load tasks for a workspace
     */
    loadByWorkspace: rxMethod<string>(
      pipe(
        switchMap((workspaceId) => {
          patchState(store, { isLoading: true, error: null });
          return from(repo.findByWorkspaceId(WorkspaceId.create(workspaceId))).pipe(
            tapResponse({
              next: (tasks) => patchState(store, { tasks, isLoading: false, error: null }),
              error: (err: any) => patchState(store, { error: err.message, isLoading: false })
            })
          );
        })
      )
    ),

    /**
     * Add task (saves to repo then updates state)
     */
    async addTask(task: TaskAggregate): Promise<void> {
      patchState(store, { isLoading: true, error: null });
      try {
        await repo.save(task);
        // Optimistic update or waiting for reload? 
        // We'll append locally for responsiveness, assuming success.
        patchState(store, {
          tasks: [...store.tasks(), task],
          isLoading: false,
          error: null
        });
      } catch (err: any) {
        patchState(store, { error: err.message, isLoading: false });
        throw err;
      }
    },

    /**
     * Update task
     */
    async updateTask(taskId: string, updates: Partial<TaskAggregate>): Promise<void> {
      const task = store.tasks().find(t => t.id === taskId);
      if (!task) {
        patchState(store, { error: `Task ${taskId} not found` });
        return;
      }

      const updatedTask = { ...task, ...updates, updatedAt: Date.now() }; // Assuming updatedAt exists on Aggregate. 
      // STRICT NOTE: Aggregate updates should technically go through Domain Methods, but for this Refactor of Application Layer, we assume DTO/Structure compatibility.
      
      patchState(store, { isLoading: true, error: null });
      
      try {
        await repo.save(updatedTask);
         patchState(store, {
          tasks: store.tasks().map(t => t.id === taskId ? updatedTask : t),
          isLoading: false,
          error: null
        });
      } catch (err: any) {
        patchState(store, { error: err.message, isLoading: false });
      }
    },

    /**
     * Delete Task
     */
    async deleteTask(taskId: string): Promise<void> {
       patchState(store, { isLoading: true, error: null });
       try {
         await repo.delete(TaskId.create(taskId));
         patchState(store, {
            tasks: store.tasks().filter(t => t.id !== taskId),
            isLoading: false,
            error: null
         });
       } catch (err: any) {
         patchState(store, { error: err.message, isLoading: false });
       }
    }
  }))
);
