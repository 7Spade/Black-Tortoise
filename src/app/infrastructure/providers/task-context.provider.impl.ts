/**
 * Task Context Provider Implementation
 *
 * Layer: Infrastructure
 * DDD Pattern: Anti-Corruption Layer Implementation
 *
 * Concrete implementation of TaskContextProvider using TasksStore.
 */

import { Injectable, inject } from '@angular/core';
import { TaskContextProvider } from '@application/providers/task-context.provider';
import { TasksStore } from '@application/stores/tasks.store';
import { TaskReadyForQCSpecification } from '@domain/specifications/task-ready-for-qc.specification';

@Injectable({
  providedIn: 'root',
})
export class TaskContextProviderImpl extends TaskContextProvider {
  private readonly tasksStore = inject(TasksStore);
  private readonly qcSpec = new TaskReadyForQCSpecification();

  getTaskStatus(taskId: string): string | null {
    const task = this.tasksStore.tasks().get(taskId);
    return task?.status ?? null;
  }

  getTaskProgress(taskId: string): number {
    const task = this.tasksStore.tasks().get(taskId);
    return task?.progress ?? 0;
  }

  canSubmitForQC(taskId: string): boolean {
    const task = this.tasksStore.tasks().get(taskId);
    if (!task) return false;

    return this.qcSpec.isSatisfiedBy(task);
  }

  hasBlockingIssues(taskId: string): boolean {
    const task = this.tasksStore.tasks().get(taskId);
    return task ? task.blockedByIssueIds.length > 0 : false;
  }

  getTask(taskId: string): any | null {
    return this.tasksStore.tasks().get(taskId) ?? null;
  }
}
