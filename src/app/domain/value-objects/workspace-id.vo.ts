/**
 * WorkspaceId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 * 
 * Represents a unique identifier for a workspace.
 * Value objects are immutable and equality is based on value, not identity.
 */

export class WorkspaceId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('WorkspaceId cannot be empty');
    }
    this.value = value;
  }

  /**
   * Create a new WorkspaceId from a string value
   */
  static create(value: string): WorkspaceId {
    return new WorkspaceId(value);
  }

  /**
   * Generate a new unique WorkspaceId
   */
  static generate(): WorkspaceId {
    return new WorkspaceId(crypto.randomUUID());
  }

  /**
   * Get the string value of the WorkspaceId
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Check equality with another WorkspaceId
   */
  equals(other: WorkspaceId): boolean {
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
