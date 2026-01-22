/**
 * Task Aggregate Root
 * 
 * Layer: Domain
 * DDD Pattern: Aggregate Root
 * 
 * The Task aggregate manages task lifecycle, status transitions, and task-related operations.
 * It enforces business rules around task creation, assignment, and completion.
 */

import { TaskId } from '../value-objects/task-id.vo';
import { WorkspaceId } from '../value-objects/workspace-id.vo';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskAggregate {
  readonly id: TaskId;
  readonly workspaceId: WorkspaceId;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly assigneeId?: string;
  readonly createdBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly completedAt?: Date;
  readonly dueDate?: Date;
  readonly version: number;
}

/**
 * Create a new Task aggregate
 */
export function createTask(
  id: TaskId,
  workspaceId: WorkspaceId,
  title: string,
  description: string,
  createdBy: string,
  priority: TaskPriority = 'medium',
  assigneeId?: string,
  dueDate?: Date
): TaskAggregate {
  if (!title || title.trim().length === 0) {
    throw new Error('Task title cannot be empty');
  }

  if (!createdBy || createdBy.trim().length === 0) {
    throw new Error('Task creator ID cannot be empty');
  }

  return {
    id,
    workspaceId,
    title: title.trim(),
    description: description.trim(),
    status: 'todo',
    priority,
    assigneeId,
    createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate,
    version: 1,
  };
}

/**
 * Update task details
 */
export function updateTask(
  task: TaskAggregate,
  title?: string,
  description?: string,
  priority?: TaskPriority,
  dueDate?: Date
): TaskAggregate {
  if (title !== undefined && title.trim().length === 0) {
    throw new Error('Task title cannot be empty');
  }

  return {
    ...task,
    title: title ? title.trim() : task.title,
    description: description !== undefined ? description.trim() : task.description,
    priority: priority ?? task.priority,
    dueDate: dueDate !== undefined ? dueDate : task.dueDate,
    updatedAt: new Date(),
    version: task.version + 1,
  };
}

/**
 * Assign task to user
 */
export function assignTask(
  task: TaskAggregate,
  assigneeId: string
): TaskAggregate {
  if (!assigneeId || assigneeId.trim().length === 0) {
    throw new Error('Assignee ID cannot be empty');
  }

  return {
    ...task,
    assigneeId,
    updatedAt: new Date(),
    version: task.version + 1,
  };
}

/**
 * Unassign task
 */
export function unassignTask(task: TaskAggregate): TaskAggregate {
  return {
    ...task,
    assigneeId: undefined,
    updatedAt: new Date(),
    version: task.version + 1,
  };
}

/**
 * Start working on task
 */
export function startTask(task: TaskAggregate): TaskAggregate {
  if (task.status !== 'todo') {
    throw new Error(`Cannot start task in ${task.status} status`);
  }

  return {
    ...task,
    status: 'in-progress',
    updatedAt: new Date(),
    version: task.version + 1,
  };
}

/**
 * Move task to review
 */
export function moveTaskToReview(task: TaskAggregate): TaskAggregate {
  if (task.status !== 'in-progress') {
    throw new Error(`Cannot move task to review from ${task.status} status`);
  }

  return {
    ...task,
    status: 'review',
    updatedAt: new Date(),
    version: task.version + 1,
  };
}

/**
 * Complete task
 */
export function completeTask(task: TaskAggregate): TaskAggregate {
  if (task.status === 'done') {
    throw new Error('Task is already completed');
  }

  if (task.status === 'cancelled') {
    throw new Error('Cannot complete a cancelled task');
  }

  return {
    ...task,
    status: 'done',
    completedAt: new Date(),
    updatedAt: new Date(),
    version: task.version + 1,
  };
}

/**
 * Cancel task
 */
export function cancelTask(task: TaskAggregate): TaskAggregate {
  if (task.status === 'done') {
    throw new Error('Cannot cancel a completed task');
  }

  if (task.status === 'cancelled') {
    throw new Error('Task is already cancelled');
  }

  return {
    ...task,
    status: 'cancelled',
    updatedAt: new Date(),
    version: task.version + 1,
  };
}

/**
 * Reopen task
 */
export function reopenTask(task: TaskAggregate): TaskAggregate {
  if (task.status !== 'done' && task.status !== 'cancelled') {
    throw new Error(`Cannot reopen task in ${task.status} status`);
  }

  return {
    ...task,
    status: 'todo',
    completedAt: undefined,
    updatedAt: new Date(),
    version: task.version + 1,
  };
}
