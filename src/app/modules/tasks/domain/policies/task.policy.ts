import { TaskAggregate } from '@tasks/domain/aggregates/task.aggregate';
import { TaskPriority, TaskPriorityEnum } from '@tasks/domain/value-objects/task-priority.vo';
import { TaskStatus, TaskStatusEnum } from '@tasks/domain/value-objects/task-status.vo';

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
  if (!task.dueDate || task.status.getValue() === TaskStatusEnum.COMPLETED) {
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
  const current = currentStatus.getValue();
  const newSt = newStatus.getValue();

  // Cannot transition to the same status
  if (current === newSt) {
    return {
      isValid: false,
      reason: 'Task is already in this status',
    };
  }

  // Define valid transitions
  const validTransitions: Partial<Record<TaskStatusEnum, TaskStatusEnum[]>> = {
    [TaskStatusEnum.DRAFT]: [TaskStatusEnum.READY],
    [TaskStatusEnum.READY]: [TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.BLOCKED],
    [TaskStatusEnum.IN_PROGRESS]: [TaskStatusEnum.IN_QC, TaskStatusEnum.BLOCKED, TaskStatusEnum.READY],
    [TaskStatusEnum.IN_QC]: [TaskStatusEnum.COMPLETED, TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.BLOCKED, TaskStatusEnum.QC_FAILED],
    [TaskStatusEnum.QC_FAILED]: [TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.BLOCKED],
    [TaskStatusEnum.IN_ACCEPTANCE]: [TaskStatusEnum.ACCEPTED, TaskStatusEnum.REJECTED],
    [TaskStatusEnum.ACCEPTED]: [TaskStatusEnum.COMPLETED],
    [TaskStatusEnum.REJECTED]: [TaskStatusEnum.IN_PROGRESS],
    [TaskStatusEnum.COMPLETED]: [TaskStatusEnum.READY, TaskStatusEnum.IN_PROGRESS],
    [TaskStatusEnum.BLOCKED]: [TaskStatusEnum.READY, TaskStatusEnum.IN_PROGRESS],
  };

  const allowedStatuses = validTransitions[current] || [];
  if (!allowedStatuses.includes(newSt)) {
    return {
      isValid: false,
      reason: 'Cannot transition from ' + current + ' to ' + newSt,
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
  switch (status.getValue()) {
    case TaskStatusEnum.DRAFT:
    case TaskStatusEnum.READY:
    case TaskStatusEnum.BLOCKED:
      return 0;
    case TaskStatusEnum.IN_PROGRESS:
      return 40;
    case TaskStatusEnum.IN_QC:
    case TaskStatusEnum.QC_FAILED:
      return 80;
    case TaskStatusEnum.IN_ACCEPTANCE:
    case TaskStatusEnum.REJECTED:
      return 90;
    case TaskStatusEnum.ACCEPTED:
    case TaskStatusEnum.COMPLETED:
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
  byStatus: Record<TaskStatusEnum, number>;
  byPriority: Record<TaskPriorityEnum, number>;
  overdue: number;
  completionRate: number;
} {
  const summary = {
    total: tasks.length,
    byStatus: {
      [TaskStatusEnum.DRAFT]: 0,
      [TaskStatusEnum.READY]: 0,
      [TaskStatusEnum.IN_PROGRESS]: 0,
      [TaskStatusEnum.IN_QC]: 0,
      [TaskStatusEnum.QC_FAILED]: 0,
      [TaskStatusEnum.IN_ACCEPTANCE]: 0,
      [TaskStatusEnum.ACCEPTED]: 0,
      [TaskStatusEnum.REJECTED]: 0,
      [TaskStatusEnum.COMPLETED]: 0,
      [TaskStatusEnum.BLOCKED]: 0,
      [TaskStatusEnum.TODO]: 0,
      [TaskStatusEnum.IN_REVIEW]: 0,
    } as Record<TaskStatusEnum, number>,
    byPriority: {
      [TaskPriorityEnum.LOW]: 0,
      [TaskPriorityEnum.MEDIUM]: 0,
      [TaskPriorityEnum.HIGH]: 0,
      [TaskPriorityEnum.CRITICAL]: 0,
    } as Record<TaskPriorityEnum, number>,
    overdue: 0,
    completionRate: 0,
  };

  tasks.forEach((task: TaskAggregate) => {
    const status = task.status.getValue();
    const priority = task.priority.getValue();

    summary.byStatus[status] = (summary.byStatus[status] || 0) + 1;
    summary.byPriority[priority] = (summary.byPriority[priority] || 0) + 1;

    if (isTaskOverdue(task)) {
      summary.overdue++;
    }
  });

  const completedCount = summary.byStatus[TaskStatusEnum.COMPLETED] + summary.byStatus[TaskStatusEnum.ACCEPTED];
  summary.completionRate = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return summary;
}
