/**
 * Issue Aggregate Root
 * 
 * Layer: Domain
 * DDD Pattern: Aggregate Root
 * 
 * The Issue aggregate manages issue tracking, status transitions, and resolutions.
 * It enforces business rules around issue lifecycle and assignment.
 */

import { WorkspaceId } from '@domain/value-objects';

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REOPENED = 'reopened',
  WONT_FIX = 'wont-fix',
}

export enum IssuePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IssueType {
  BUG = 'bug',
  FEATURE = 'feature',
  ENHANCEMENT = 'enhancement',
  QUESTION = 'question',
  DOCUMENTATION = 'documentation',
}

export interface IssueAggregate {
  readonly id: string;
  readonly workspaceId: WorkspaceId;
  readonly title: string;
  readonly description: string;
  readonly type: IssueType;
  readonly status: IssueStatus;
  readonly priority: IssuePriority;
  readonly assigneeId?: string;
  readonly taskId?: string;
  readonly reportedBy: string;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly resolvedAt?: number;
  readonly closedAt?: number;
  readonly version: number;
}

/**
 * Create a new Issue aggregate
 */
export function createIssue(
  id: string,
  workspaceId: WorkspaceId,
  title: string,
  description: string,
  type: IssueType,
  priority: IssuePriority,
  reportedBy: string,
  assigneeId?: string,
  taskId?: string
): IssueAggregate {
  if (!title || title.trim().length === 0) {
    throw new Error('Issue title cannot be empty');
  }

  if (!reportedBy || reportedBy.trim().length === 0) {
    throw new Error('Issue reporter ID cannot be empty');
  }

  const result: IssueAggregate = {
    id,
    workspaceId,
    title: title.trim(),
    description: description.trim(),
    type,
    status: IssueStatus.OPEN,
    priority,
    reportedBy,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1,
  };
  
  if (assigneeId !== undefined) {
    (result as any).assigneeId = assigneeId;
  }

  if (taskId !== undefined) {
    (result as any).taskId = taskId;
  }
  
  return result;
}

/**
 * Update issue details
 */
export function updateIssue(
  issue: IssueAggregate,
  title?: string,
  description?: string,
  type?: IssueType,
  priority?: IssuePriority
): IssueAggregate {
  if (title !== undefined && title.trim().length === 0) {
    throw new Error('Issue title cannot be empty');
  }

  return {
    ...issue,
    title: title ? title.trim() : issue.title,
    description: description !== undefined ? description.trim() : issue.description,
    type: type ?? issue.type,
    priority: priority ?? issue.priority,
    updatedAt: Date.now(),
    version: issue.version + 1,
  };
}

/**
 * Assign issue to user
 */
export function assignIssue(
  issue: IssueAggregate,
  assigneeId: string
): IssueAggregate {
  if (!assigneeId || assigneeId.trim().length === 0) {
    throw new Error('Assignee ID cannot be empty');
  }

  return {
    ...issue,
    assigneeId,
    updatedAt: Date.now(),
    version: issue.version + 1,
  };
}

/**
 * Start working on issue
 */
export function startIssue(issue: IssueAggregate): IssueAggregate {
  if (issue.status !== IssueStatus.OPEN) {
    throw new Error(`Cannot start issue in ${issue.status} status`);
  }

  return {
    ...issue,
    status: IssueStatus.IN_PROGRESS,
    updatedAt: Date.now(),
    version: issue.version + 1,
  };
}

/**
 * Resolve issue
 */
export function resolveIssue(issue: IssueAggregate): IssueAggregate {
  if (issue.status === IssueStatus.RESOLVED || issue.status === IssueStatus.CLOSED) {
    throw new Error(`Cannot resolve issue in ${issue.status} status`);
  }

  return {
    ...issue,
    status: IssueStatus.RESOLVED,
    resolvedAt: Date.now(),
    updatedAt: Date.now(),
    version: issue.version + 1,
  };
}

/**
 * Close issue
 */
export function closeIssue(issue: IssueAggregate): IssueAggregate {
  if (issue.status === IssueStatus.CLOSED) {
    throw new Error('Issue is already closed');
  }

  return {
    ...issue,
    status: IssueStatus.CLOSED,
    closedAt: Date.now(),
    updatedAt: Date.now(),
    version: issue.version + 1,
  };
}

/**
 * Mark issue as won't fix
 */
export function wontFixIssue(issue: IssueAggregate): IssueAggregate {
  if (issue.status === IssueStatus.CLOSED || issue.status === IssueStatus.WONT_FIX) {
    throw new Error(`Cannot mark issue as won't fix in ${issue.status} status`);
  }

  return {
    ...issue,
    status: IssueStatus.WONT_FIX,
    closedAt: Date.now(),
    updatedAt: Date.now(),
    version: issue.version + 1,
  };
}

/**
 * Reopen issue
 */
export function reopenIssue(issue: IssueAggregate): IssueAggregate {
  if (issue.status !== IssueStatus.RESOLVED && issue.status !== IssueStatus.CLOSED) {
    throw new Error(`Cannot reopen issue in ${issue.status} status`);
  }

  const result: IssueAggregate = {
    ...issue,
    status: IssueStatus.REOPENED,
    updatedAt: Date.now(),
    version: issue.version + 1,
  };
  
  // Remove optional fields by creating a new object without them
  const { resolvedAt, closedAt, ...rest } = result;
  return rest as IssueAggregate;
}
