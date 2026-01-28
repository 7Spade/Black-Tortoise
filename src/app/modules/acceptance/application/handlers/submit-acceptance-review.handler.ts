/**
 * SubmitAcceptanceReviewHandler
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { SubmitAcceptanceReviewCommand } from '@acceptance/application/commands/submit-acceptance-review.command';
// import { AcceptanceRepository } from '@acceptance/domain';

@Injectable({ providedIn: 'root' })
export class SubmitAcceptanceReviewHandler {
  // private repo = inject(AcceptanceRepository);

  async execute(command: SubmitAcceptanceReviewCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute SubmitAcceptanceReviewHandler', command);
  }
}
