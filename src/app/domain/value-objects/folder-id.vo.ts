/**
 * FolderId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 * 
 * Strongly-typed identifier for folders.
 * Immutable and validates UUID format.
 */

export class FolderId {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('FolderId cannot be empty');
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error('FolderId must be a valid UUID');
    }
  }

  /**
   * Create new FolderId from string
   */
  static create(value: string): FolderId {
    return new FolderId(value);
  }

  /**
   * Generate new unique FolderId
   */
  static generate(): FolderId {
    return new FolderId(crypto.randomUUID());
  }

  /**
   * Get string value
   */
  toString(): string {
    return this.value;
  }

  /**
   * Equality comparison
   */
  equals(other: FolderId): boolean {
    return this.value === other.value;
  }
}
