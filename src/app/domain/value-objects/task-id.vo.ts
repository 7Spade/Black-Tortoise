/**
 * TaskId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 * 
 * Represents a unique identifier for a task.
 * Value objects are immutable and equality is based on value, not identity.
 */

export class TaskId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('TaskId cannot be empty');
    }
    this.value = value;
  }

  /**
   * Create a new TaskId from a string value
   */
  static create(value: string): TaskId {
    return new TaskId(value);
  }

  /**
   * Generate a new unique TaskId
   */
  static generate(): TaskId {
    return new TaskId(crypto.randomUUID());
  }

  /**
   * Get the string value of the TaskId
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Check equality with another TaskId
   */
  equals(other: TaskId): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return this.value;
  }
}
