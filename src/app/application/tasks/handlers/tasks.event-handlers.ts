import { inject } from '@angular/core';
import { EVENT_BUS } from '@application/events';
import { EventBus } from '@domain/event-bus/event-bus.interface';
import { TaskCreatedEvent, TaskSubmittedForQCEvent, QCFailedEvent, IssueResolvedEvent } from '@domain/events/domain-events';
import { TasksStore } from '../stores/tasks.store';
import { createTask, updateTaskStatus, TaskStatus } from '@domain/task/task.entity';

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
