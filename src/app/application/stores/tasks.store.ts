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
import { TASK_REPOSITORY } from '@application/interfaces';
import {
  TaskAggregate,
  TaskPriority,
  TaskStatus,
  createTask,
  computeParentProgress,
} from '@domain/aggregates';
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
export { TaskAggregate, TaskPriority, TaskStatus, createTask };

export type ViewMode = 'list' | 'gantt' | 'kanban' | 'calendar';

/**
 * Tasks State
 */
export interface TasksState {
  readonly tasks: ReadonlyMap<string, TaskAggregate>;
  readonly viewMode: ViewMode;
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: TasksState = {
  tasks: new Map(),
  viewMode: 'list',
  isLoading: false,
  error: null,
};

/**
 * Kanban Column
 */
export interface KanbanColumn {
  readonly status: TaskStatus;
  readonly tasks: ReadonlyArray<TaskAggregate>;
}

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
     * Task list (array view from map)
     */
    taskList: computed(() => Array.from(state.tasks().values())),

    /**
     * Root tasks (no parent)
     */
    rootTasks: computed(() =>
      Array.from(state.tasks().values()).filter((t) => !t.parentId),
    ),

    /**
     * Tasks by status
     */
    tasksByStatus: computed(
      () => (status: TaskStatus) =>
        Array.from(state.tasks().values()).filter((t) => t.status === status),
    ),

    /**
     * Kanban columns (grouped by status)
     */
    kanbanColumns: computed(() => {
      const columns: KanbanColumn[] = [];
      const statuses = Object.values(TaskStatus);

      for (const status of statuses) {
        columns.push({
          status,
          tasks: Array.from(state.tasks().values()).filter(
            (t) => t.status === status,
          ),
        });
      }

      return columns;
    }),

    /**
     * Task hierarchy (tree structure)
     */
    taskHierarchy: computed(() => {
      const tasks = Array.from(state.tasks().values());
      const rootTasks = tasks.filter((t) => !t.parentId);

      const buildTree = (task: TaskAggregate): any => {
        const children = tasks
          .filter((t) => t.parentId === task.id)
          .map(buildTree);

        return {
          ...task,
          children,
        };
      };

      return rootTasks.map(buildTree);
    }),

    /**
     * Blocked tasks
     */
    blockedTasks: computed(() =>
      Array.from(state.tasks().values()).filter(
        (t) => t.status === TaskStatus.BLOCKED,
      ),
    ),

    /**
     * Ready tasks
     */
    readyTasks: computed(() =>
      Array.from(state.tasks().values()).filter(
        (t) => t.status === TaskStatus.READY,
      ),
    ),

    /**
     * Tasks in QC
     */
    tasksInQC: computed(() =>
      Array.from(state.tasks().values()).filter(
        (t) => t.status === TaskStatus.IN_QC,
      ),
    ),

    /**
     * Task count
     */
    taskCount: computed(() => state.tasks().size),
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
            return from(
              repo.findByWorkspaceId(WorkspaceId.create(workspaceId)),
            ).pipe(
              tapResponse({
                next: (taskArray) => {
                  const taskMap = new Map<string, TaskAggregate>();
                  for (const task of taskArray) {
                    taskMap.set(task.id, task);
                  }
                  patchState(store, {
                    tasks: taskMap,
                    isLoading: false,
                    error: null,
                  });
                },
                error: (err: any) =>
                  patchState(store, { error: err.message, isLoading: false }),
              }),
            );
          }),
        ),
      ),

      /**
       * Set view mode
       */
      setViewMode(viewMode: ViewMode): void {
        patchState(store, { viewMode });
      },

      /**
       * Add task to local state (Reactive Update)
       * Triggered by: EventBus (TaskCreated)
       */
      addTask(task: TaskAggregate): void {
        const newTasks = new Map(store.tasks());
        newTasks.set(task.id, task);

        patchState(store, {
          tasks: newTasks,
          error: null,
        });
      },

      /**
       * Update task in local state (Reactive Update)
       * Triggered by: EventBus (TaskUpdated, etc.)
       */
      updateTask(
        taskId: string,
        updates: Partial<TaskAggregate>,
        updatedAt: number = Date.now(),
      ): void {
        const task = store.tasks().get(taskId);
        if (!task) return;

        const updatedTask = { ...task, ...updates, updatedAt };
        const newTasks = new Map(store.tasks());
        newTasks.set(taskId, updatedTask);

        patchState(store, {
          tasks: newTasks,
          error: null,
        });
      },

      /**
       * Update parent progress based on subtasks
       */
      updateParentProgress(parentId: string): void {
        const parent = store.tasks().get(parentId);
        if (!parent) return;

        const subtasks = Array.from(store.tasks().values()).filter(
          (t) => t.parentId === parentId,
        );

        const progress = computeParentProgress(subtasks);

        const updatedParent = { ...parent, progress, updatedAt: Date.now() };
        const newTasks = new Map(store.tasks());
        newTasks.set(parentId, updatedParent);

        patchState(store, {
          tasks: newTasks,
          error: null,
        });
      },

      /**
       * Delete Task from local state (Reactive Update)
       * Triggered by: EventBus (TaskDeleted)
       */
      deleteTask(taskId: string): void {
        const newTasks = new Map(store.tasks());
        newTasks.delete(taskId);

        patchState(store, {
          tasks: newTasks,
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
