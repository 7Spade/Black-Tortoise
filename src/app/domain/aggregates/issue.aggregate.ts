/**
 * Issue Aggregate Root
 * 
 * Layer: Domain
 * DDD Pattern: Aggregate Root
 * 
 * The Issue aggregate manages issue tracking, status transitions, and resolutions.
 * It enforces business rules around issue lifecycle and assignment.
 */

import { WorkspaceId } from '../value-objects/workspace-id.vo';

export type IssueStatus = 'open' | 'in-progress' | 'resolved' | 'closed' | 'wont-fix';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueType = 'bug' | 'feature' | 'enhancement' | 'question' | 'documentation';

export interface IssueAggregate {
  readonly id: string;
  readonly workspaceId: WorkspaceId;
  readonly title: string;
  readonly description: string;
  readonly type: IssueType;
  readonly status: IssueStatus;
  readonly priority: IssuePriority;
  readonly assigneeId?: string;
  readonly reportedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly resolvedAt?: Date;
  readonly closedAt?: Date;
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
  assigneeId?: string
): IssueAggregate {
  if (!title || title.trim().length === 0) {
    throw new Error('Issue title cannot be empty');
  }

  if (!reportedBy || reportedBy.trim().length === 0) {
    throw new Error('Issue reporter ID cannot be empty');
  }

  return {
    id,
    workspaceId,
    title: title.trim(),
    description: description.trim(),
    type,
    status: 'open',
    priority,
    assigneeId,
    reportedBy,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  };
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
    updatedAt: new Date(),
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
    updatedAt: new Date(),
    version: issue.version + 1,
  };
}

/**
 * Start working on issue
 */
export function startIssue(issue: IssueAggregate): IssueAggregate {
  if (issue.status !== 'open') {
    throw new Error(`Cannot start issue in ${issue.status} status`);
  }

  return {
    ...issue,
    status: 'in-progress',
    updatedAt: new Date(),
    version: issue.version + 1,
  };
}

/**
 * Resolve issue
 */
export function resolveIssue(issue: IssueAggregate): IssueAggregate {
  if (issue.status === 'resolved' || issue.status === 'closed') {
    throw new Error(`Cannot resolve issue in ${issue.status} status`);
  }

  return {
    ...issue,
    status: 'resolved',
    resolvedAt: new Date(),
    updatedAt: new Date(),
    version: issue.version + 1,
  };
}

/**
 * Close issue
 */
export function closeIssue(issue: IssueAggregate): IssueAggregate {
  if (issue.status === 'closed') {
    throw new Error('Issue is already closed');
  }

  return {
    ...issue,
    status: 'closed',
    closedAt: new Date(),
    updatedAt: new Date(),
    version: issue.version + 1,
  };
}

/**
 * Mark issue as won't fix
 */
export function wontFixIssue(issue: IssueAggregate): IssueAggregate {
  if (issue.status === 'closed' || issue.status === 'wont-fix') {
    throw new Error(`Cannot mark issue as won't fix in ${issue.status} status`);
  }

  return {
    ...issue,
    status: 'wont-fix',
    closedAt: new Date(),
    updatedAt: new Date(),
    version: issue.version + 1,
  };
}

/**
 * Reopen issue
 */
export function reopenIssue(issue: IssueAggregate): IssueAggregate {
  if (issue.status !== 'resolved' && issue.status !== 'closed') {
    throw new Error(`Cannot reopen issue in ${issue.status} status`);
  }

  return {
    ...issue,
    status: 'open',
    resolvedAt: undefined,
    closedAt: undefined,
    updatedAt: new Date(),
    version: issue.version + 1,
  };
}
