/**
 * SubmitDailyEntryHandler
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { SubmitDailyEntryCommand } from '../commands/submit-daily-entry.command';
// import { DailyRepository } from '@daily/domain';

@Injectable({ providedIn: 'root' })
export class SubmitDailyEntryHandler {
  // private repo = inject(DailyRepository);

  async execute(command: SubmitDailyEntryCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute SubmitDailyEntryHandler', command);
  }
}
