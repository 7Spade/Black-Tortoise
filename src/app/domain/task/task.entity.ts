/**
 * Task Entity
 * 
 * Layer: Domain
 * DDD Pattern: Entity (Aggregate Root)
 * 
 * Core business logic for tasks within a workspace.
 * Pure TypeScript - no framework dependencies.
 */

export type TaskStatus = 
  | 'draft'
  | 'ready'
  | 'in-progress'
  | 'in-qc'
  | 'qc-failed'
  | 'in-acceptance'
  | 'accepted'
  | 'rejected'
  | 'completed'
  | 'blocked';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Task Entity
 */
export interface TaskEntity {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly assigneeId: string | null;
  readonly createdById: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly dueDate: Date | null;
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
  readonly dueDate?: Date | null;
}

/**
 * Create a new Task entity
 */
export function createTask(params: CreateTaskParams): TaskEntity {
  const now = new Date();
  
  return {
    id: crypto.randomUUID(),
    workspaceId: params.workspaceId,
    title: params.title,
    description: params.description,
    status: 'draft',
    priority: params.priority ?? 'medium',
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
export function updateTaskStatus(task: TaskEntity, newStatus: TaskStatus): TaskEntity {
  return {
    ...task,
    status: newStatus,
    updatedAt: new Date(),
  };
}

/**
 * Block task with issue
 */
export function blockTask(task: TaskEntity, issueId: string): TaskEntity {
  if (task.blockedByIssueIds.includes(issueId)) {
    return task;
  }
  
  return {
    ...task,
    status: 'blocked',
    blockedByIssueIds: [...task.blockedByIssueIds, issueId],
    updatedAt: new Date(),
  };
}

/**
 * Unblock task when issue is resolved
 */
export function unblockTask(task: TaskEntity, issueId: string): TaskEntity {
  const newBlockedIds = task.blockedByIssueIds.filter(id => id !== issueId);
  
  return {
    ...task,
    status: newBlockedIds.length === 0 ? 'ready' : 'blocked',
    blockedByIssueIds: newBlockedIds,
    updatedAt: new Date(),
  };
}
