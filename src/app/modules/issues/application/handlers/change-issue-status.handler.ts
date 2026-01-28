/**
 * ChangeIssueStatusHandler
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { ChangeIssueStatusCommand } from '../commands/change-issue-status.command';
// import { IssueRepository } from '@issues/domain';

@Injectable({ providedIn: 'root' })
export class ChangeIssueStatusHandler {
  // private repo = inject(IssueRepository);

  async execute(command: ChangeIssueStatusCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute ChangeIssueStatusHandler', command);
  }
}
