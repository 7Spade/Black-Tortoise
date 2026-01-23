/**
 * Task Repository Interface
 * 
 * Layer: Domain
 * DDD Pattern: Repository Interface
 * 
 * Defines the contract for task persistence operations.
 * The actual implementation will be in the Infrastructure layer.
 * This interface is pure TypeScript with no framework dependencies.
 */

import { TaskId } from '../value-objects/task-id.vo';
import { TaskAggregate } from '../aggregates/task.aggregate';
import { WorkspaceId } from '../value-objects/workspace-id.vo';

export interface TaskRepository {
  /**
   * Find a task by its ID
   * @returns The task if found, undefined otherwise
   */
  findById(id: TaskId): Promise<TaskAggregate | undefined>;

  /**
   * Find all tasks in a workspace
   */
  findByWorkspaceId(workspaceId: WorkspaceId): Promise<TaskAggregate[]>;

  /**
   * Find all tasks assigned to a user
   */
  findByAssigneeId(assigneeId: string): Promise<TaskAggregate[]>;

  /**
   * Find tasks by status
   */
  findByStatus(workspaceId: WorkspaceId, status: string): Promise<TaskAggregate[]>;

  /**
   * Find tasks by priority
   */
  findByPriority(workspaceId: WorkspaceId, priority: string): Promise<TaskAggregate[]>;

  /**
   * Find overdue tasks
   */
  findOverdue(workspaceId: WorkspaceId): Promise<TaskAggregate[]>;

  /**
   * Find tasks due within a date range
   */
  findByDueDateRange(workspaceId: WorkspaceId, startDate: Date, endDate: Date): Promise<TaskAggregate[]>;

  /**
   * Save a task (create or update)
   */
  save(task: TaskAggregate): Promise<void>;

  /**
   * Delete a task by ID
   */
  delete(id: TaskId): Promise<void>;

  /**
   * Check if a task exists
   */
  exists(id: TaskId): Promise<boolean>;

  /**
   * Count total tasks in a workspace
   */
  countByWorkspace(workspaceId: WorkspaceId): Promise<number>;

  /**
   * Count tasks by status
   */
  countByStatus(workspaceId: WorkspaceId, status: string): Promise<number>;
}
