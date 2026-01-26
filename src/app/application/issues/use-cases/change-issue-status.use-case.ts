/**
 * ChangeIssueStatusUseCase
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { ChangeIssueStatusCommand } from '../commands/change-issue-status.command';
// import { IssuesRepository } from '@domain/modules/issues/repositories';

@Injectable({ providedIn: 'root' })
export class ChangeIssueStatusUseCase {
  // private repo = inject(IssuesRepository);

  async execute(command: ChangeIssueStatusCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute ChangeIssueStatusUseCase', command);
  }
}
