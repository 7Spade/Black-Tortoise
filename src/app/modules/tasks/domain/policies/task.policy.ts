import { TaskAggregate } from '@tasks/domain/aggregates/task.aggregate';
import { TaskPriority } from '@tasks/domain/value-objects/task-priority.vo';
import { TaskStatus } from '@tasks/domain/value-objects/task-status.vo';

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

  if (dueDate.getTime() < now.getTime()) {
    errors.push('Due date cannot be in the past');
  }

  // Check if due date is too far in the future (e.g., 5 years)
  const fiveYearsFromNow = new Date();
  fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);

  if (dueDate.getTime() > fiveYearsFromNow.getTime()) {
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
    return TaskPriority.CRITICAL;
  }

  // Calculate days until due
  let daysUntilDue = Infinity;
  if (dueDate) {
    const now = new Date();
    daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Critical if due within 3 days or has many dependents
  if (daysUntilDue <= 3 || dependentTaskCount > 5) {
    return TaskPriority.CRITICAL;
  }

  // High if due within a week or multiple assignees
  if (daysUntilDue <= 7 || assigneeCount > 2) {
    return TaskPriority.HIGH;
  }

  // Medium if due within 2 weeks
  if (daysUntilDue <= 14) {
    return TaskPriority.MEDIUM;
  }

  return TaskPriority.LOW;
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

  if (task.status === TaskStatus.COMPLETED) {
    return {
      canComplete: false,
      reason: 'Task is already completed',
    };
  }

  if (task.status === TaskStatus.BLOCKED) {
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
  if (!task.dueDate || task.status === TaskStatus.COMPLETED) {
    return false;
  }

  const now = new Date();
  return task.dueDate < now.getTime();
}

/**
 * Calculate days until due
 */
export function getDaysUntilDue(dueDate: number): number {
  const now = new Date();
  const diffTime = dueDate - now.getTime();
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
  const validTransitions: Partial<Record<TaskStatus, TaskStatus[]>> = {
    [TaskStatus.DRAFT]: [TaskStatus.READY],
    [TaskStatus.READY]: [TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED],
    [TaskStatus.IN_PROGRESS]: [TaskStatus.IN_QC, TaskStatus.BLOCKED, TaskStatus.READY],
    [TaskStatus.IN_QC]: [TaskStatus.COMPLETED, TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED, TaskStatus.QC_FAILED],
    [TaskStatus.QC_FAILED]: [TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED],
    [TaskStatus.IN_ACCEPTANCE]: [TaskStatus.ACCEPTED, TaskStatus.REJECTED],
    [TaskStatus.ACCEPTED]: [TaskStatus.COMPLETED],
    [TaskStatus.REJECTED]: [TaskStatus.IN_PROGRESS],
    [TaskStatus.COMPLETED]: [TaskStatus.READY, TaskStatus.IN_PROGRESS],
    [TaskStatus.BLOCKED]: [TaskStatus.READY, TaskStatus.IN_PROGRESS],
  };

  const allowedStatuses = validTransitions[currentStatus] || [];
  if (!allowedStatuses.includes(newStatus)) {
    return {
      isValid: false,
      reason: 'Cannot transition from ' + currentStatus + ' to ' + newStatus,
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
  switch (status) {
    case TaskStatus.DRAFT:
    case TaskStatus.READY:
    case TaskStatus.BLOCKED:
      return 0;
    case TaskStatus.IN_PROGRESS:
      return 40;
    case TaskStatus.IN_QC:
    case TaskStatus.QC_FAILED:
      return 80;
    case TaskStatus.IN_ACCEPTANCE:
    case TaskStatus.REJECTED:
      return 90;
    case TaskStatus.ACCEPTED:
    case TaskStatus.COMPLETED:
      return 100;
    default:
      return 0;
  }
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
      [TaskStatus.DRAFT]: 0,
      [TaskStatus.READY]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.IN_QC]: 0,
      [TaskStatus.QC_FAILED]: 0,
      [TaskStatus.IN_ACCEPTANCE]: 0,
      [TaskStatus.ACCEPTED]: 0,
      [TaskStatus.REJECTED]: 0,
      [TaskStatus.COMPLETED]: 0,
      [TaskStatus.BLOCKED]: 0,
    } as Record<TaskStatus, number>,
    byPriority: {
      [TaskPriority.LOW]: 0,
      [TaskPriority.MEDIUM]: 0,
      [TaskPriority.HIGH]: 0,
      [TaskPriority.CRITICAL]: 0,
    } as Record<TaskPriority, number>,
    overdue: 0,
    completionRate: 0,
  };

  tasks.forEach((task: TaskAggregate) => {
    summary.byStatus[task.status] = (summary.byStatus[task.status] || 0) + 1;
    summary.byPriority[task.priority] = (summary.byPriority[task.priority] || 0) + 1;

    if (isTaskOverdue(task)) {
      summary.overdue++;
    }
  });

  const completedCount = summary.byStatus[TaskStatus.COMPLETED] + summary.byStatus[TaskStatus.ACCEPTED];
  summary.completionRate = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return summary;
}
