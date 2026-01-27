/**
 * Task Hierarchy Policy
 *
 * Layer: Domain
 * DDD Pattern: Policy
 *
 * Encapsulates business rules for task hierarchy depth limits.
 */

import { TaskAggregate } from '@domain/aggregates/task.aggregate';

export class TaskHierarchyPolicy {
  private static readonly MAX_DEPTH = 10;

  /**
   * Calculate depth of a task in the hierarchy
   */
  public static calculateDepth(
    task: TaskAggregate,
    allTasks: ReadonlyArray<TaskAggregate>,
  ): number {
    let depth = 0;
    let currentTask = task;

    while (currentTask.parentId) {
      depth++;
      const parent = allTasks.find((t) => t.id === currentTask.parentId);
      if (!parent) break;
      currentTask = parent;
    }

    return depth;
  }

  /**
   * Check if a subtask can be added to the parent
   */
  public static canAddSubtask(
    parent: TaskAggregate,
    allTasks: ReadonlyArray<TaskAggregate>,
  ): boolean {
    const depth = this.calculateDepth(parent, allTasks);
    return depth < this.MAX_DEPTH;
  }

  /**
   * Assert that a subtask can be added, throw if not
   */
  public static assertCanAddSubtask(
    parent: TaskAggregate,
    allTasks: ReadonlyArray<TaskAggregate>,
  ): void {
    if (!this.canAddSubtask(parent, allTasks)) {
      throw new Error(
        `Maximum task depth (${this.MAX_DEPTH}) exceeded`,
      );
    }
  }
}
