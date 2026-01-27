/**
 * Task Entity
 *
 * Layer: Domain
 * DDD Pattern: Entity (Aggregate Root)
 *
 * Core business logic for tasks within a workspace.
 * Pure TypeScript - no framework dependencies.
 */

import { Money } from '@domain/value-objects/money.vo';

export enum TaskStatus {
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

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Task Aggregate Root
 */
export interface TaskAggregate {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly assigneeId: string | null;
  readonly createdById: string;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly dueDate: number | null;
  readonly blockedByIssueIds: ReadonlyArray<string>;
  
  // Extended fields for v2.0
  readonly unitPrice: Money | null;
  readonly quantity: number;
  readonly totalPrice: Money | null;
  readonly progress: number;
  readonly parentId: string | null;
  readonly subtaskIds: ReadonlyArray<string>;
  readonly assigneeIds: ReadonlyArray<string>;
  readonly responsibleId: string | null;
  readonly collaboratorIds: ReadonlyArray<string>;
}

/**
 * Create Task Parameters
 */
export interface CreateTaskParams {
  readonly id?: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly createdById: string;
  readonly priority?: TaskPriority;
  readonly assigneeId?: string | null;
  readonly dueDate?: number | null;
  readonly unitPrice?: Money | null;
  readonly quantity?: number;
  readonly parentId?: string | null;
}

/**
 * Create a new Task entity
 */
export function createTask(params: CreateTaskParams): TaskAggregate {
  const now = Date.now();
  const quantity = params.quantity ?? 1;
  const unitPrice = params.unitPrice ?? null;
  
  // Calculate totalPrice if unitPrice is provided
  const totalPrice = unitPrice 
    ? { amount: unitPrice.amount * quantity, currency: unitPrice.currency }
    : null;

  return {
    id: params.id ?? crypto.randomUUID(),
    workspaceId: params.workspaceId,
    title: params.title,
    description: params.description,
    status: TaskStatus.DRAFT,
    priority: params.priority ?? TaskPriority.MEDIUM,
    assigneeId: params.assigneeId ?? null,
    createdById: params.createdById,
    createdAt: now,
    updatedAt: now,
    dueDate: params.dueDate ?? null,
    blockedByIssueIds: [],
    unitPrice,
    quantity,
    totalPrice,
    progress: 0,
    parentId: params.parentId ?? null,
    subtaskIds: [],
    assigneeIds: params.assigneeId ? [params.assigneeId] : [],
    responsibleId: params.assigneeId ?? null,
    collaboratorIds: [],
  };
}

/**
 * Update task status
 */
export function updateTaskStatus(
  task: TaskAggregate,
  newStatus: TaskStatus,
): TaskAggregate {
  return {
    ...task,
    status: newStatus,
    updatedAt: Date.now(),
  };
}

/**
 * Block task with issue
 */
export function blockTask(task: TaskAggregate, issueId: string): TaskAggregate {
  if (task.blockedByIssueIds.includes(issueId)) {
    return task;
  }

  return {
    ...task,
    status: TaskStatus.BLOCKED,
    blockedByIssueIds: [...task.blockedByIssueIds, issueId],
    updatedAt: Date.now(),
  };
}

/**
 * Unblock task when issue is resolved
 */
export function unblockTask(
  task: TaskAggregate,
  issueId: string,
): TaskAggregate {
  const newBlockedIds = task.blockedByIssueIds.filter(
    (id: string) => id !== issueId,
  );

  return {
    ...task,
    status: newBlockedIds.length === 0 ? TaskStatus.READY : TaskStatus.BLOCKED,
    blockedByIssueIds: newBlockedIds,
    updatedAt: Date.now(),
  };
}

/**
 * Restore Task from persistence or event
 * (Strict DDD: Used for reconstitution, bypassing invariant checks if needed, or just mapping)
 */
export function restoreTask(state: TaskAggregate): TaskAggregate {
  return { ...state };
}

/**
 * Update task progress
 */
export function updateProgress(
  task: TaskAggregate,
  progress: number,
): TaskAggregate {
  if (progress < 0 || progress > 100) {
    throw new Error('Progress must be between 0 and 100');
  }

  return {
    ...task,
    progress,
    updatedAt: Date.now(),
  };
}

/**
 * Add subtask ID to parent task
 */
export function addSubtask(
  parent: TaskAggregate,
  subtaskId: string,
): TaskAggregate {
  if (parent.subtaskIds.includes(subtaskId)) {
    return parent;
  }

  return {
    ...parent,
    subtaskIds: [...parent.subtaskIds, subtaskId],
    updatedAt: Date.now(),
  };
}

/**
 * Remove subtask ID from parent task
 */
export function removeSubtask(
  parent: TaskAggregate,
  subtaskId: string,
): TaskAggregate {
  return {
    ...parent,
    subtaskIds: parent.subtaskIds.filter(id => id !== subtaskId),
    updatedAt: Date.now(),
  };
}

/**
 * Compute parent progress from subtasks
 * Formula: Σ(childProgress × childTotalPrice) / Σ(childTotalPrice)
 */
export function computeParentProgress(
  subtasks: ReadonlyArray<TaskAggregate>,
): number {
  if (subtasks.length === 0) {
    return 0;
  }

  let totalWeightedProgress = 0;
  let totalWeight = 0;

  for (const subtask of subtasks) {
    const weight = subtask.totalPrice?.amount ?? 1;
    totalWeightedProgress += subtask.progress * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? totalWeightedProgress / totalWeight : 0;
}

/**
 * Update assignees
 */
export function updateAssignees(
  task: TaskAggregate,
  assigneeIds: ReadonlyArray<string>,
  responsibleId: string | null,
): TaskAggregate {
  return {
    ...task,
    assigneeIds,
    responsibleId,
    // Keep legacy assigneeId for backward compatibility
    assigneeId: responsibleId,
    updatedAt: Date.now(),
  };
}

/**
 * Update collaborators
 */
export function updateCollaborators(
  task: TaskAggregate,
  collaboratorIds: ReadonlyArray<string>,
): TaskAggregate {
  return {
    ...task,
    collaboratorIds,
    updatedAt: Date.now(),
  };
}
