/**
 * Task Factory
 *
 * Layer: Domain
 * DDD Pattern: Factory
 *
 * Creates task aggregates while enforcing domain policies.
 */

import {
  CreateTaskParams,
  TaskAggregate,
  createTask,
} from '@domain/aggregates/task.aggregate';
import { TaskHierarchyPolicy } from '@domain/policies/task-hierarchy.policy';
import { TaskNamingPolicy } from '@domain/policies/task-naming.policy';

export class TaskFactory {
  /**
   * Create a new task with policy enforcement
   */
  public static create(params: CreateTaskParams): TaskAggregate {
    // Enforce naming policy
    TaskNamingPolicy.assertIsValid(params.title);

    // Use aggregate's create function
    return createTask(params);
  }

  /**
   * Create a subtask under a parent task
   */
  public static createSubtask(
    parent: TaskAggregate,
    params: Omit<CreateTaskParams, 'parentId'>,
    allTasks: ReadonlyArray<TaskAggregate>,
  ): TaskAggregate {
    // Enforce hierarchy policy
    TaskHierarchyPolicy.assertCanAddSubtask(parent, allTasks);

    // Enforce naming policy
    TaskNamingPolicy.assertIsValid(params.title);

    // Create subtask with parent reference
    return createTask({
      ...params,
      parentId: parent.id,
    });
  }
}
