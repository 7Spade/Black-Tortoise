/**
 * RefreshDashboardHandler
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { RefreshDashboardCommand } from '../commands/refresh-dashboard.command';
// import { OverviewRepository } from '@overview/domain';

@Injectable({ providedIn: 'root' })
export class RefreshDashboardHandler {
  // private repo = inject(OverviewRepository);

  async execute(command: RefreshDashboardCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute RefreshDashboardHandler', command);
  }
}
