/**
 * Task Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy (Business Rules)
 * 
 * Encapsulates complex business rules related to tasks.
 * Policies are stateless and operate on domain objects to enforce business rules.
 * 
 * This policy handles task-specific business rules such as:
 * - Task priority calculation
 * - Due date validation
 * - Task completion rules
 * - Task dependency validation
 */

import { TaskAggregate } from '../aggregates/task.aggregate';
// import { TaskId } from '../value-objects/task-id.vo'; // Unused in original file but kept import if needed later, though linter might complain. Original used it but didn't seem to use it in code.

/**
 * Task priority levels
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Task status values
 */
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';

/**
 * Validates task title according to business rules
 */
export function validateTaskTitle(title: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!title || title.trim().length === 0) {
    errors.push('Task title cannot be empty');
  }

  if (title.length < 3) {
    errors.push('Task title must be at least 3 characters long');
  }

  if (title.length > 200) {
    errors.push('Task title cannot exceed 200 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates task due date
 */
export function validateDueDate(dueDate: Date): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const now = new Date();

  if (dueDate < now) {
    errors.push('Due date cannot be in the past');
  }

  // Check if due date is too far in the future (e.g., 5 years)
  const fiveYearsFromNow = new Date();
  fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);

  if (dueDate > fiveYearsFromNow) {
    errors.push('Due date cannot be more than 5 years in the future');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate task priority based on multiple factors
 */
export function calculateTaskPriority(factors: {
  dueDate?: Date;
  hasBlockers: boolean;
  assigneeCount: number;
  dependentTaskCount: number;
}): TaskPriority {
  const { dueDate, hasBlockers, assigneeCount, dependentTaskCount } = factors;

  // Blocked tasks are always critical
  if (hasBlockers) {
    return 'critical';
  }

  // Calculate days until due
  let daysUntilDue = Infinity;
  if (dueDate) {
    const now = new Date();
    daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Critical if due within 3 days or has many dependents
  if (daysUntilDue <= 3 || dependentTaskCount > 5) {
    return 'critical';
  }

  // High if due within a week or multiple assignees
  if (daysUntilDue <= 7 || assigneeCount > 2) {
    return 'high';
  }

  // Medium if due within 2 weeks
  if (daysUntilDue <= 14) {
    return 'medium';
  }

  return 'low';
}

/**
 * Check if a task can be completed
 */
export function canCompleteTask(
  task: TaskAggregate,
  hasBlockingDependencies: boolean
): {
  canComplete: boolean;
  reason?: string;
} {
  if (hasBlockingDependencies) {
    return {
      canComplete: false,
      reason: 'Cannot complete task while dependencies are incomplete',
    };
  }

  if (task.status === 'done') {
    return {
      canComplete: false,
      reason: 'Task is already completed',
    };
  }

  if (task.status === 'blocked') {
    return {
      canComplete: false,
      reason: 'Task is blocked and cannot be completed',
    };
  }

  return { canComplete: true };
}

/**
 * Check if a task is overdue
 */
export function isTaskOverdue(task: TaskAggregate): boolean {
  if (!task.dueDate || task.status === 'done') {
    return false;
  }

  const now = new Date();
  return task.dueDate < now;
}

/**
 * Calculate days until due
 */
export function getDaysUntilDue(dueDate: Date): number {
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if task status transition is valid
 */
export function isValidStatusTransition(
  currentStatus: TaskStatus,
  newStatus: TaskStatus
): {
  isValid: boolean;
  reason?: string;
} {
  // Cannot transition to the same status
  if (currentStatus === newStatus) {
    return {
      isValid: false,
      reason: 'Task is already in this status',
    };
  }

  // Define valid transitions
  const validTransitions: Record<TaskStatus, TaskStatus[]> = {
    todo: ['in-progress', 'blocked'],
    'in-progress': ['review', 'blocked', 'todo'],
    review: ['done', 'in-progress', 'blocked'],
    done: ['todo'], // Can reopen
    blocked: ['todo', 'in-progress'],
  };

  const allowedStatuses = validTransitions[currentStatus];
  if (!allowedStatuses.includes(newStatus)) {
    return {
      isValid: false,
      reason: `Cannot transition from ${currentStatus} to ${newStatus}`,
    };
  }

  return { isValid: true };
}

/**
 * Estimate task completion percentage
 */
export function estimateCompletionPercentage(
  status: TaskStatus,
  hasSubtasks: boolean,
  completedSubtasks?: number,
  totalSubtasks?: number
): number {
  // If we have subtask data, use it
  if (hasSubtasks && totalSubtasks && totalSubtasks > 0) {
    return Math.round(((completedSubtasks || 0) / totalSubtasks) * 100);
  }

  // Otherwise estimate based on status
  const statusPercentages: Record<TaskStatus, number> = {
    todo: 0,
    'in-progress': 40,
    review: 80,
    done: 100,
    blocked: 0,
  };

  return statusPercentages[status];
}

/**
 * Generate task summary for reporting
 */
export function generateTaskSummary(tasks: TaskAggregate[]): {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  overdue: number;
  completionRate: number;
} {
  const summary = {
    total: tasks.length,
    byStatus: {
      todo: 0,
      'in-progress': 0,
      review: 0,
      done: 0,
      blocked: 0,
    } as Record<TaskStatus, number>,
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    } as Record<TaskPriority, number>,
    overdue: 0,
    completionRate: 0,
  };

  tasks.forEach((task) => {
    summary.byStatus[task.status as TaskStatus] =
      (summary.byStatus[task.status as TaskStatus] || 0) + 1;
    summary.byPriority[task.priority as TaskPriority] =
      (summary.byPriority[task.priority as TaskPriority] || 0) + 1;

    if (isTaskOverdue(task)) {
      summary.overdue++;
    }
  });

  summary.completionRate =
    tasks.length > 0 ? (summary.byStatus.done / tasks.length) * 100 : 0;

  return summary;
}
