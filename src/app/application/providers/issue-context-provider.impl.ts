/**
 * Issue Context Provider Implementation
 *
 * Layer: Application
 * DDD Pattern: Context Provider Implementation
 *
 * Concrete implementation using IssuesStore.
 */

import { inject, Injectable } from '@angular/core';
import { IssueStatus } from '@domain/aggregates';
import { IssuesStore } from '../stores/issues.store';
import { IssueContextProvider } from './issue-context.provider';

@Injectable({ providedIn: 'root' })
export class IssueContextProviderImpl extends IssueContextProvider {
  private readonly issuesStore = inject(IssuesStore);

  hasBlockingIssues(taskId: string): boolean {
    const issues = this.issuesStore.getIssuesByTask()(taskId);
    return issues.some(
      (issue) =>
        issue.status === IssueStatus.OPEN ||
        issue.status === IssueStatus.IN_PROGRESS ||
        issue.status === IssueStatus.REOPENED
    );
  }

  getOpenIssuesCount(taskId: string): number {
    const issues = this.issuesStore.getIssuesByTask()(taskId);
    return issues.filter(
      (issue) =>
        issue.status === IssueStatus.OPEN ||
        issue.status === IssueStatus.IN_PROGRESS ||
        issue.status === IssueStatus.REOPENED
    ).length;
  }
}
