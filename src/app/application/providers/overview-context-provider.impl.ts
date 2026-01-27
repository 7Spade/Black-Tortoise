/**
 * Overview Context Provider Implementation
 * 
 * Layer: Application
 * Purpose: Concrete implementation of OverviewContextProvider
 * 
 * This implementation wraps OverviewStore and provides a stable
 * interface for other modules to query overview data.
 */

import { Injectable, inject } from '@angular/core';
import { OverviewStore, WorkspaceMetrics } from '@application/stores/overview.store';
import { ModuleStats, OverviewContextProvider } from './overview-context.provider';

/**
 * Default Implementation of OverviewContextProvider
 * 
 * Delegates to OverviewStore for data access.
 */
@Injectable()
export class OverviewContextProviderImpl extends OverviewContextProvider {
  private readonly store = inject(OverviewStore);

  /**
   * Get current workspace metrics from store
   */
  getWorkspaceMetrics(): WorkspaceMetrics {
    return this.store.metrics();
  }

  /**
   * Get statistics for a specific module
   * 
   * Calculates module-specific stats from current metrics.
   */
  getModuleStats(moduleId: string): ModuleStats | null {
    const metrics = this.store.metrics();

    switch (moduleId) {
      case 'tasks':
        return {
          moduleId: 'tasks',
          itemCount: metrics.totalTasks,
          completedCount: metrics.completedTasks,
          pendingCount: metrics.activeTasks,
        };

      case 'issues':
        return {
          moduleId: 'issues',
          itemCount: metrics.openIssues,
          completedCount: 0, // Issues don't track completed in metrics
          pendingCount: metrics.openIssues,
        };

      case 'qc':
      case 'quality-control':
        return {
          moduleId: 'qc',
          itemCount: metrics.pendingQC,
          completedCount: 0,
          pendingCount: metrics.pendingQC,
        };

      case 'acceptance':
        return {
          moduleId: 'acceptance',
          itemCount: metrics.pendingAcceptance,
          completedCount: 0,
          pendingCount: metrics.pendingAcceptance,
        };

      default:
        return null;
    }
  }
}
