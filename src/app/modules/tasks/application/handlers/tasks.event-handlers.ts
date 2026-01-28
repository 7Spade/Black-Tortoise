import { inject } from '@angular/core';
import {
  TaskAggregate,
  TaskId,
  TaskStatus,
} from '@tasks/domain';
import {
  IssueResolved,
  QCFailed,
  TaskCreated,
  TaskSubmittedForQC,
} from '@events';
import { EventBus } from '@application/interfaces/event-bus.interface';
import { TasksStore } from '@application/stores/tasks.store';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';

/**
 * Register event handlers for the tasks module
 */
export function registerTasksEventHandlers(): void {
  const eventBus = inject(EventBus);
  const tasksStore = inject(TasksStore);

  // Handle TaskCreated
  eventBus.subscribe<TaskCreated['payload']>('TaskCreated', (event) => {
    console.log('[TasksEventHandlers] TaskCreated:', event);

    // Fallback workspaceId if not in event payload
    const workspaceIdStr = (event.payload as any).workspaceId || '';

    const task = TaskAggregate.create(
      TaskId.create(event.payload.taskId),
      WorkspaceId.create(workspaceIdStr),
      event.payload.title
    );
    tasksStore.syncTask(task);
  });

  // Handle TaskSubmittedForQC
  eventBus.subscribe<TaskSubmittedForQC['payload']>(
    'TaskSubmittedForQC',
    (event) => {
      console.log('[TasksEventHandlers] TaskSubmittedForQC:', event);
      const existingTask = tasksStore
        .tasks()
        .find((t) => t.id.value === (event.payload as any).taskId || event.aggregateId);
      if (existingTask) {
        const updatedTask = existingTask.cloneWith({
          status: TaskStatus.inQc(),
        });
        tasksStore.syncTask(updatedTask);
      }
    },
  );

  // Handle QCFailed
  eventBus.subscribe<QCFailed['payload']>('QCFailed', (event) => {
    console.log('[TasksEventHandlers] QCFailed:', event);
    const existingTask = tasksStore
      .tasks()
      .find((t) => t.id.value === (event.payload as any).taskId || event.aggregateId);
    if (existingTask) {
      const updatedTask = existingTask.cloneWith({
        status: TaskStatus.qcFailed(),
      });
      tasksStore.syncTask(updatedTask);
    }
  });

  // Handle IssueResolved
  eventBus.subscribe<IssueResolved['payload']>('IssueResolved', (event) => {
    console.log('[TasksEventHandlers] IssueResolved:', event);
    // IssueResolved payload has taskId or we use aggregateId of the issue as causationId?
    // According to previous logic:
    const taskId = (event.payload as any).taskId;
    const existingTask = tasksStore.tasks().find((t) => t.id.value === taskId);

    if (existingTask) {
      const updatedTask = existingTask.resolveIssue(event.aggregateId);
      tasksStore.syncTask(updatedTask);
    }
  });

  // Handle WorkspaceSwitched
  eventBus.subscribe('WorkspaceSwitched', () => {
    console.log('[TasksEventHandlers] WorkspaceSwitched, resetting store');
    tasksStore.reset();
  });

  console.log('[TasksEventHandlers] Registered event handlers for tasks');
}
