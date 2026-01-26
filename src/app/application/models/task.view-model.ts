/**
 * Task View Model
 * 
 * Layer: Application
 * Purpose: Presentation-safe task model and factory
 * 
 * Provides task structure for UI without exposing Domain layer.
 * Factory functions delegate to Use Case handlers.
 */

import { TaskPriorityEnum } from './task-priority.enum';

/**
 * Task Status Enum (Application layer)
 */
export enum TaskStatusEnum {
  DRAFT = 'draft',
  READY = 'ready',
  IN_PROGRESS = 'in-progress',
  IN_QC = 'in-qc',
  QC_FAILED = 'qc-failed',
  IN_ACCEPTANCE = 'in-acceptance',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
}

/**
 * Task View Model
 * Mirrors TaskAggregate but in Application layer
 */
export interface TaskViewModel {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatusEnum;
  readonly priority: TaskPriorityEnum;
  readonly assigneeId: string | null;
  readonly createdById: string;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly dueDate: number | null;
  readonly blockedByIssueIds: ReadonlyArray<string>;
}

/**
 * Create Task Command (for use case handlers)
 */
export interface CreateTaskCommand {
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly createdById: string;
  readonly priority?: TaskPriorityEnum;
  readonly assigneeId?: string | null;
  readonly dueDate?: number | null;
}

/**
 * Helper to get default priority
 */
export function getDefaultTaskPriority(): TaskPriorityEnum {
  return TaskPriorityEnum.MEDIUM;
}

/**
 * Helper to get all priority options (for dropdowns)
 */
export function getAllTaskPriorities(): TaskPriorityEnum[] {
  return [
    TaskPriorityEnum.LOW,
    TaskPriorityEnum.MEDIUM,
    TaskPriorityEnum.HIGH,
    TaskPriorityEnum.CRITICAL,
  ];
}
