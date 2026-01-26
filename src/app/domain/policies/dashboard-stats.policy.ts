/**
 * Dashboard Statistics Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 */

/**
 * Calculate completion rate
 */
export function calculateCompletionRate(
  completed: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Identify if workload is critical
 */
export function isWorkloadCritical(
  activeTaskCount: number,
  pendingIssuesCount: number
): boolean {
  return activeTaskCount > 20 || pendingIssuesCount > 10;
}
