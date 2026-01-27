/**
 * Task Ready For QC Specification
 *
 * Layer: Domain
 * DDD Pattern: Specification
 *
 * Determines if a task is ready for quality control.
 */

import { TaskAggregate, TaskStatus } from '@domain/aggregates/task.aggregate';

export class TaskReadyForQCSpecification {
  /**
   * Check if task satisfies QC readiness criteria
   */
  public isSatisfiedBy(task: TaskAggregate): boolean {
    return (
      (task.status === TaskStatus.IN_PROGRESS || task.status === TaskStatus.READY) &&
      task.progress === 100 &&
      task.blockedByIssueIds.length === 0
    );
  }

  /**
   * Provide detailed reasons why task is not ready for QC
   */
  public whyNotSatisfied(task: TaskAggregate): string[] {
    const reasons: string[] = [];

    if (task.status !== TaskStatus.IN_PROGRESS && task.status !== TaskStatus.READY) {
      reasons.push(`Task must be In Progress or Ready (current: ${task.status})`);
    }

    if (task.progress < 100) {
      reasons.push(`Progress must be 100% (current: ${task.progress}%)`);
    }

    if (task.blockedByIssueIds.length > 0) {
      reasons.push(`Task has ${task.blockedByIssueIds.length} blocking issue(s)`);
    }

    return reasons;
  }
}
