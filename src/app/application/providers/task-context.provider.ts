/**
 * Task Context Provider
 *
 * Layer: Application
 * DDD Pattern: Anti-Corruption Layer / Context Provider
 *
 * Provides read-only access to task state for other modules.
 * This prevents tight coupling between modules.
 */

export abstract class TaskContextProvider {
  /**
   * Get task status by ID
   */
  abstract getTaskStatus(taskId: string): string | null;

  /**
   * Get task progress by ID
   */
  abstract getTaskProgress(taskId: string): number;

  /**
   * Check if task can be submitted for QC
   */
  abstract canSubmitForQC(taskId: string): boolean;

  /**
   * Check if task has blocking issues
   */
  abstract hasBlockingIssues(taskId: string): boolean;

  /**
   * Get task by ID
   */
  abstract getTask(taskId: string): any | null;
}
