/**
 * UpdateIssueHandler
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { UpdateIssueCommand } from '../commands/update-issue.command';
// import { IssueRepository } from '@domain/repositories';

@Injectable({ providedIn: 'root' })
export class UpdateIssueHandler {
  // private repo = inject(IssueRepository);

  async execute(command: UpdateIssueCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute UpdateIssueHandler', command);
  }
}
