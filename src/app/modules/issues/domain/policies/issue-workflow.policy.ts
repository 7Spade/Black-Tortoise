/**
 * Issue Workflow Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 */

import { IssueStatus, IssueStatusEnum } from '@issues/domain/value-objects/issue-status.vo';

/**
 * Valid transitions for issue status
 */
export function isValidIssueTransition(
  currentStatus: IssueStatus,
  newStatus: IssueStatus
): { valid: boolean; reason?: string } {
  if (currentStatus.equals(newStatus)) {
    return { valid: false, reason: 'Issue is already in this status' };
  }

  // Define allowed transitions using enum values for keys
  const transitions: Record<IssueStatusEnum, IssueStatusEnum[]> = {
    [IssueStatusEnum.OPEN]: [IssueStatusEnum.IN_PROGRESS, IssueStatusEnum.RESOLVED, IssueStatusEnum.CLOSED, IssueStatusEnum.WONT_FIX],
    [IssueStatusEnum.IN_PROGRESS]: [IssueStatusEnum.RESOLVED, IssueStatusEnum.CLOSED, IssueStatusEnum.WONT_FIX, IssueStatusEnum.OPEN], // Can go back to open? Yes.
    [IssueStatusEnum.RESOLVED]: [IssueStatusEnum.CLOSED, IssueStatusEnum.OPEN], // Reopen or Close
    [IssueStatusEnum.CLOSED]: [IssueStatusEnum.OPEN], // Only Reopen
    [IssueStatusEnum.WONT_FIX]: [IssueStatusEnum.OPEN, IssueStatusEnum.CLOSED], // Reopen or explicit Close
    [IssueStatusEnum.REOPENED]: [IssueStatusEnum.IN_PROGRESS, IssueStatusEnum.RESOLVED, IssueStatusEnum.CLOSED]
  };

  const currentAllowed = transitions[currentStatus.value];
  if (!currentAllowed || !currentAllowed.includes(newStatus.value)) {
    return { valid: false, reason: `Invalid transition from ${currentStatus.value} to ${newStatus.value}` };
  }

  return { valid: true };
}

export function canStartIssue(status: IssueStatus): boolean {
  return status.value === IssueStatusEnum.OPEN;
}

export function canResolveIssue(status: IssueStatus): boolean {
  return status.value !== IssueStatusEnum.RESOLVED && status.value !== IssueStatusEnum.CLOSED;
}

export function canCloseIssue(status: IssueStatus): boolean {
  return status.value !== IssueStatusEnum.CLOSED;
}
