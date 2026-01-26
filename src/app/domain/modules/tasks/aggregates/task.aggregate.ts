/**
 * Task Entity
 * 
 * Layer: Domain
 * DDD Pattern: Entity (Aggregate Root)
 * 
 * Core business logic for tasks within a workspace.
 * Pure TypeScript - no framework dependencies.
 */

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
}

/**
 * Create Task Parameters
 */
export interface CreateTaskParams {
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly createdById: string;
  readonly priority?: TaskPriority;
  readonly assigneeId?: string | null;
  readonly dueDate?: number | null;
}

/**
 * Create a new Task entity
 */
export function createTask(params: CreateTaskParams): TaskAggregate {
  const now = Date.now();
  
  return {
    id: crypto.randomUUID(),
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
  };
}

/**
 * Update task status
 */
export function updateTaskStatus(task: TaskAggregate, newStatus: TaskStatus): TaskAggregate {
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
export function unblockTask(task: TaskAggregate, issueId: string): TaskAggregate {
  const newBlockedIds = task.blockedByIssueIds.filter((id: string) => id !== issueId);
  
  return {
    ...task,
    status: newBlockedIds.length === 0 ? TaskStatus.READY : TaskStatus.BLOCKED,
    blockedByIssueIds: newBlockedIds,
    updatedAt: Date.now(),
  };
}
