/**
 * Issue Context Provider
 *
 * Layer: Application
 * DDD Pattern: Anti-Corruption Layer / Context Provider
 *
 * Provides read-only access to issue state for other modules (e.g., Tasks).
 * Prevents tight coupling between modules.
 */

export abstract class IssueContextProvider {
  /**
   * Check if task has blocking issues (OPEN or IN_PROGRESS)
   */
  abstract hasBlockingIssues(taskId: string): boolean;

  /**
   * Get count of open issues for a task
   */
  abstract getOpenIssuesCount(taskId: string): number;
}
