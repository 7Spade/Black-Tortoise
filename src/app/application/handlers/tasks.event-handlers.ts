import { inject } from '@angular/core';
import { IssueResolvedEvent } from '@domain/modules/issues/events/issue-resolved.event';
import { QCFailedEvent } from '@domain/modules/quality-control/events/qc-failed.event';
import { createTask, TaskStatus, updateTaskStatus } from '@domain/modules/tasks/aggregates/task.aggregate';
import { TaskCreatedEvent } from '@domain/modules/tasks/events/task-created.event';
import { TaskSubmittedForQCEvent } from '@domain/modules/tasks/events/task-submitted-for-qc.event';
import { EventBus } from '@domain/shared/events/event-bus/event-bus.interface';
import { TasksStore } from '../stores/tasks.store';

export function registerTasksEventHandlers(eventBus: EventBus): void {
  const tasksStore = inject(TasksStore);
  
  eventBus.subscribe<TaskCreatedEvent['payload']>(
    'TaskCreated',
    (event) => {
      console.log('[TasksEventHandlers] TaskCreated:', event);
      const task = createTask({
        workspaceId: event.payload.workspaceId,
        title: event.payload.title,
        description: event.payload.description,
        createdById: event.payload.createdById,
        priority: event.payload.priority,
      });
      tasksStore.addTask(task);
    }
  );
  
  eventBus.subscribe<TaskSubmittedForQCEvent['payload']>(
    'TaskSubmittedForQC',
    (event) => {
      console.log('[TasksEventHandlers] TaskSubmittedForQC:', event);
      const existingTask = tasksStore.tasks().find(t => t.id === event.aggregateId);
      if (existingTask) {
        const updatedTask = updateTaskStatus(existingTask, TaskStatus.IN_QC);
        tasksStore.updateTask(updatedTask.id, updatedTask);
      }
    }
  );
  
  eventBus.subscribe<QCFailedEvent['payload']>(
    'QCFailed',
    (event) => {
      console.log('[TasksEventHandlers] QCFailed:', event);
      const existingTask = tasksStore.tasks().find(t => t.id === event.aggregateId);
      if (existingTask) {
        const updatedTask = updateTaskStatus(existingTask, TaskStatus.QC_FAILED);
        tasksStore.updateTask(updatedTask.id, updatedTask);
      }
    }
  );
  
  eventBus.subscribe<IssueResolvedEvent['payload']>(
    'IssueResolved',
    (event) => {
      console.log('[TasksEventHandlers] IssueResolved:', event);
      const existingTask = tasksStore.tasks().find(t => t.id === event.payload.taskId);
      if (existingTask && existingTask.blockedByIssueIds.includes(event.aggregateId)) {
        const updatedTask = {
          ...existingTask,
          status: TaskStatus.READY,
          blockedByIssueIds: existingTask.blockedByIssueIds.filter(id => id !== event.aggregateId),
        };
        tasksStore.updateTask(updatedTask.id, updatedTask);
      }
    }
  );
  
  console.log('[TasksEventHandlers] Registered event handlers for workspace');
}



