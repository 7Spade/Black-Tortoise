import { Injectable, inject, signal } from '@angular/core';
import {
  TaskAggregate,
  TaskPriority,
  TaskStatus,
  createTask,
} from '../../domain/aggregates/task.aggregate';
import { ResolveIssueHandler } from '../handlers/resolve-issue.handler';
import { FailQCHandler } from '../handlers/fail-qc.handler';
import { SubmitTaskForQCHandler } from '../handlers/submit-task-for-qc.handler';
import { CreateTaskHandler } from '../handlers/create-task.handler';
import { IModuleEventBus } from '../interfaces/module-event-bus.interface';
import { TasksStore } from '../stores/tasks.store';

@Injectable({
  providedIn: 'root',
})
export class TasksFacade {
  private readonly store = inject(TasksStore);
  private readonly createTaskHandler = inject(CreateTaskHandler);
  private readonly submitTaskForQCHandler = inject(SubmitTaskForQCHandler);
  private readonly failQCUseCase = inject(FailQCHandler);
  private readonly resolveIssueHandler = inject(ResolveIssueHandler);

  // Signals exposed to View
  readonly tasks = this.store.tasks;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;

  // View State managed by Facade
  readonly workspaceId = signal<string>('');
  readonly eventLog = signal<any[]>([]);
  readonly currentUserId = signal<string>('user-demo-001');

  private eventBus?: IModuleEventBus;

  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;
    this.workspaceId.set(eventBus.workspaceId);

    // Subscribe to events
    // Ideally this should be in the Store using rxMethod, but for this refactor we move it here
    // to clean the component first.
    eventBus.subscribe('TaskCreated', (event: any) => this.logEvent(event));
    eventBus.subscribe('QCFailed', (event: any) => this.logEvent(event));
    eventBus.subscribe('IssueCreated', (event: any) => this.logEvent(event));
    eventBus.subscribe('IssueResolved', (event: any) => this.logEvent(event));

    eventBus.subscribe('WorkspaceSwitched', () => {
      this.store.reset();
      this.eventLog.set([]);
    });
  }

  private logEvent(event: any): void {
    console.log('[TasksFacade] Event received', event);
    this.eventLog.update((log) => [event, ...log]);
  }

  async createTask(
    title: string,
    description: string,
    priority: TaskPriority,
  ): Promise<boolean> {
    const wsId = this.workspaceId();
    if (!wsId || !this.eventBus) return false;

    const task = createTask({
      workspaceId: wsId,
      title,
      description,
      createdById: this.currentUserId(),
      priority,
    });

    const result = await this.createTaskHandler.execute({
      taskId: task.id,
      workspaceId: task.workspaceId,
      title: task.title,
      description: task.description,
      priority: task.priority,
      createdById: task.createdById,
    });

    return result.success;
  }

  async submitForQC(task: TaskAggregate): Promise<void> {
    const wsId = this.workspaceId();
    if (!wsId || !this.eventBus) return;

    await this.submitTaskForQCHandler.execute({
      taskId: task.id,
      workspaceId: wsId,
      taskTitle: task.title,
      submittedBy: this.currentUserId(),
    });
  }

  async failQC(task: TaskAggregate, reason: string): Promise<void> {
    const wsId = this.workspaceId();
    if (!wsId || !this.eventBus) return;

    await this.failQCUseCase.execute({
      taskId: task.id,
      workspaceId: wsId,
      taskTitle: task.title,
      failureReason: reason,
      reviewedBy: this.currentUserId(),
    });
  }

  async resolveIssue(task: TaskAggregate, issueId: string, resolution: string): Promise<void> {
    const wsId = this.workspaceId();
    if (!wsId || !this.eventBus) return;

    await this.resolveIssueHandler.execute({
      taskId: task.id,
      issueId,
      workspaceId: wsId,
      resolvedBy: this.currentUserId(),
      resolution,
    });
  }

  // Helpers
  isTaskBlocked(task: TaskAggregate): boolean {
    return task.status === TaskStatus.BLOCKED;
  }

  isTaskFailed(task: TaskAggregate): boolean {
    return task.status === TaskStatus.QC_FAILED;
  }
}
