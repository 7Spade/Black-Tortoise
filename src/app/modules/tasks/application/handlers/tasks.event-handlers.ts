import { inject } from '@angular/core';
import { TaskAggregate, TaskStatusEnum } from '@tasks/domain';
import {
  IssueResolvedEvent,
  QCFailedEvent,
  TaskCreatedEvent,
  TaskSubmittedForQCEvent,
} from '@events';
import { EventBus } from '@domain/types';
import { TasksStore } from '@tasks/application/stores/tasks.store';

export function registerTasksEventHandlers(eventBus: EventBus): void {
  const tasksStore = inject(TasksStore);

  eventBus.subscribe<TaskCreatedEvent['payload']>('TaskCreated', (event) => {
    console.log('[TasksEventHandlers] TaskCreated:', event);
    // TaskCreatedEvent's aggregateId is taskId
    // Event handlers recreate aggregate from event payload
    const task = TaskAggregate.create({
      id: event.aggregateId,
      workspaceId: event.payload.workspaceId,
      title: event.payload.title,
      description: event.payload.description,
      createdById: event.payload.createdById,
      priority: event.payload.priority,
    });
    tasksStore.addTask(task);
  });

  eventBus.subscribe<TaskSubmittedForQCEvent['payload']>(
    'TaskSubmittedForQC',
    (event) => {
      console.log('[TasksEventHandlers] TaskSubmittedForQC:', event);
      const existingTask = tasksStore
        .tasks()
        .find((t) => t.id.value === event.aggregateId);
      if (existingTask) {
        const updatedTask = existingTask.cloneWith({
          status: TaskStatusEnum.IN_QC,
        });
        tasksStore.syncTask(updatedTask);
      }
    },
  );

  eventBus.subscribe<QCFailedEvent['payload']>('QCFailed', (event) => {
    console.log('[TasksEventHandlers] QCFailed:', event);
    const existingTask = tasksStore
      .tasks()
      .find((t) => t.id.value === event.aggregateId);
    if (existingTask) {
      const updatedTask = existingTask.cloneWith({
        status: TaskStatusEnum.QC_FAILED,
      });
      tasksStore.syncTask(updatedTask);
    }
  });

  eventBus.subscribe<IssueResolvedEvent['payload']>('IssueResolved', (event) => {
    console.log('[TasksEventHandlers] IssueResolved:', event);
    // IssueResolved payload has taskId
    const taskId = event.payload.taskId;
    const existingTask = tasksStore.tasks().find((t) => t.id.value === taskId);

    if (existingTask) {
      const updatedTask = existingTask.resolveIssue(event.aggregateId);
      tasksStore.syncTask(updatedTask);
    }
  });

  eventBus.subscribe('WorkspaceSwitched', () => {
    console.log('[TasksEventHandlers] WorkspaceSwitched, resetting store');
    tasksStore.reset();
  });

  console.log('[TasksEventHandlers] Registered event handlers for workspace');
}
