/**
 * Overview Context Provider
 * 
 * Layer: Application
 * Purpose: Abstract interface for accessing overview/dashboard data
 * 
 * This provider allows other modules to query workspace metrics and
 * module statistics without directly coupling to OverviewStore.
 * 
 * Pattern: Abstract Provider Pattern (DDD)
 * DI: Provided via InjectionToken for loose coupling
 */

import { InjectionToken } from '@angular/core';
import { WorkspaceMetrics } from '@application/stores/overview.store';

/**
 * Module Statistics Interface
 */
export interface ModuleStats {
  readonly moduleId: string;
  readonly itemCount: number;
  readonly completedCount: number;
  readonly pendingCount: number;
}

/**
 * Abstract Provider for Overview Context
 * 
 * Other modules inject this abstraction to query overview data.
 */
export abstract class OverviewContextProvider {
  /**
   * Get current workspace metrics
   */
  abstract getWorkspaceMetrics(): WorkspaceMetrics;

  /**
   * Get statistics for a specific module
   * @param moduleId - Module identifier (tasks, issues, qc, acceptance)
   * @returns Module stats or null if module not found
   */
  abstract getModuleStats(moduleId: string): ModuleStats | null;
}

/**
 * Injection Token for OverviewContextProvider
 * 
 * Usage:
 * ```typescript
 * private readonly overviewContext = inject(OVERVIEW_CONTEXT);
 * const metrics = this.overviewContext.getWorkspaceMetrics();
 * ```
 */
export const OVERVIEW_CONTEXT = new InjectionToken<OverviewContextProvider>(
  'OverviewContextProvider',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error(
        'OverviewContextProvider must be provided in app configuration'
      );
    }
  }
);
