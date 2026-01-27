/**
 * Task Completion Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 * Purpose: Prevent time logging on completed tasks
 * 
 * Business Rule: Cannot log time for tasks with status 'Completed'
 */

export class TaskCompletionPolicy {
  /**
   * Check if task status allows time logging
   */
  public static isSatisfiedBy(taskStatus: string): boolean {
    return taskStatus !== 'Completed';
  }

  /**
   * Throw error if task is completed
   */
  public static assertIsValid(taskId: string, taskStatus: string): void {
    if (!this.isSatisfiedBy(taskStatus)) {
      throw new Error(
        `Cannot log time for completed task ${taskId}. Status: ${taskStatus}`
      );
    }
  }
}
