/**
 * Tasks Event Handlers
 * 
 * Layer: Application - Event Handlers
 * Purpose: Register event handlers for Task domain events
 * 
 * Responsibilities:
 * - Subscribe to TaskCreated, TaskSubmittedForQC, QCFailed, IssueResolved events
 * - Delegate to TasksStore for state mutations
 * - Event-driven state management (react pattern)
 * 
 * Event Flow:
 * 1. Use Case publishes event via PublishEventUseCase (append → publish)
 * 2. EventBus notifies all subscribers
 * 3. This handler receives event
 * 4. Handler calls store method to mutate state
 */

import { inject } from '@angular/core';
import { EventBus } from '@domain/event-bus/event-bus.interface';
import { TaskCreatedEvent, TaskSubmittedForQCEvent, QCFailedEvent, IssueResolvedEvent } from '@domain/events/domain-events';
import { TasksStore } from '../stores/tasks.store';
import { createTask, updateTaskStatus } from '@domain/task/task.entity';

export function registerTasksEventHandlers(eventBus: EventBus): void {
  const tasksStore = inject(TasksStore);
  
  eventBus.subscribe<TaskCreatedEvent>(
    'TaskCreated',
    (event) => {
      console.log('[TasksEventHandlers] TaskCreated:', event);
      const task = createTask({
        workspaceId: event.workspaceId,
        title: event.payload.title,
        description: event.payload.description,
        createdById: event.payload.createdById,
        priority: event.payload.priority,
      });
      tasksStore.addTask(task);
    }
  );
  
  eventBus.subscribe<TaskSubmittedForQCEvent>(
    'TaskSubmittedForQC',
    (event) => {
      console.log('[TasksEventHandlers] TaskSubmittedForQC:', event);
      const existingTask = tasksStore.tasks().find(t => t.id === event.aggregateId);
      if (existingTask) {
        const updatedTask = updateTaskStatus(existingTask, 'in-qc');
        tasksStore.updateTask(updatedTask.id, updatedTask);
      }
    }
  );
  
  eventBus.subscribe<QCFailedEvent>(
    'QCFailed',
    (event) => {
      console.log('[TasksEventHandlers] QCFailed:', event);
      const existingTask = tasksStore.tasks().find(t => t.id === event.aggregateId);
      if (existingTask) {
        const updatedTask = updateTaskStatus(existingTask, 'qc-failed');
        tasksStore.updateTask(updatedTask.id, updatedTask);
      }
    }
  );
  
  eventBus.subscribe<IssueResolvedEvent>(
    'IssueResolved',
    (event) => {
      console.log('[TasksEventHandlers] IssueResolved:', event);
      const existingTask = tasksStore.tasks().find(t => t.id === event.payload.taskId);
      if (existingTask && existingTask.blockedByIssueIds.includes(event.aggregateId)) {
        const updatedTask = {
          ...existingTask,
          status: 'ready' as const,
          blockedByIssueIds: existingTask.blockedByIssueIds.filter(id => id !== event.aggregateId),
        };
        tasksStore.updateTask(updatedTask.id, updatedTask);
      }
    }
  );
  
  console.log('[TasksEventHandlers] Registered event handlers for workspace');
}
