/**
 * Task Pricing Policy
 *
 * Layer: Domain
 * DDD Pattern: Policy
 *
 * Encapsulates business rules for task pricing constraints.
 */

import { TaskAggregate } from '@domain/aggregates/task.aggregate';
import { Money } from '@domain/value-objects/money.vo';

export class TaskPricingPolicy {
  /**
   * Check if subtasks total price does not exceed parent total price
   */
  public static isSatisfiedBy(
    parent: TaskAggregate,
    subtasks: ReadonlyArray<TaskAggregate>,
  ): boolean {
    if (!parent.totalPrice) {
      return true; // No price constraint if parent has no price
    }

    const subtasksTotal = this.sumSubtaskPrices(subtasks, parent.totalPrice.currency);
    return subtasksTotal <= parent.totalPrice.amount;
  }

  /**
   * Sum total prices of subtasks
   */
  public static sumSubtaskPrices(
    subtasks: ReadonlyArray<TaskAggregate>,
    currency: string,
  ): number {
    return subtasks.reduce((sum, subtask) => {
      if (!subtask.totalPrice) return sum;
      if (subtask.totalPrice.currency !== currency) {
        throw new Error('All subtasks must use the same currency as parent');
      }
      return sum + subtask.totalPrice.amount;
    }, 0);
  }

  /**
   * Assert that pricing policy is satisfied
   */
  public static assertIsValid(
    parent: TaskAggregate,
    subtasks: ReadonlyArray<TaskAggregate>,
  ): void {
    if (!this.isSatisfiedBy(parent, subtasks)) {
      const parentTotal = parent.totalPrice?.amount ?? 0;
      const subtasksTotal = parent.totalPrice 
        ? this.sumSubtaskPrices(subtasks, parent.totalPrice.currency)
        : 0;
      
      throw new Error(
        `Subtasks total price (${subtasksTotal}) exceeds parent total price (${parentTotal})`,
      );
    }
  }
}
