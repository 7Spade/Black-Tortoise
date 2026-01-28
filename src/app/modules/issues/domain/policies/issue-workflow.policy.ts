/**
 * Issue Workflow Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 */

import { IssueStatus } from '@issues/domain/value-objects/issue-status.vo';

/**
 * Valid transitions for issue status
 */
export function isValidIssueTransition(
  currentStatus: IssueStatus,
  newStatus: IssueStatus
): { valid: boolean; reason?: string } {
  if (currentStatus === newStatus) {
    return { valid: false, reason: 'Issue is already in this status' };
  }

  // Define allowed transitions
  const transitions: Record<IssueStatus, IssueStatus[]> = {
    [IssueStatus.OPEN]: [IssueStatus.IN_PROGRESS, IssueStatus.RESOLVED, IssueStatus.CLOSED, IssueStatus.WONT_FIX],
    [IssueStatus.IN_PROGRESS]: [IssueStatus.RESOLVED, IssueStatus.CLOSED, IssueStatus.WONT_FIX, IssueStatus.OPEN], // Can go back to open? Yes.
    [IssueStatus.RESOLVED]: [IssueStatus.CLOSED, IssueStatus.OPEN], // Reopen or Close
    [IssueStatus.CLOSED]: [IssueStatus.OPEN], // Only Reopen
    [IssueStatus.WONT_FIX]: [IssueStatus.OPEN, IssueStatus.CLOSED] // Reopen or explicit Close
  };

  if (!transitions[currentStatus].includes(newStatus)) {
    return { valid: false, reason: `Invalid transition from ${currentStatus} to ${newStatus}` };
  }

  return { valid: true };
}

export function canStartIssue(status: IssueStatus): boolean {
  return status === IssueStatus.OPEN;
}

export function canResolveIssue(status: IssueStatus): boolean {
  return status !== IssueStatus.RESOLVED && status !== IssueStatus.CLOSED;
}

export function canCloseIssue(status: IssueStatus): boolean {
  return status !== IssueStatus.CLOSED;
}
