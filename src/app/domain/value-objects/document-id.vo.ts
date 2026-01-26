/**
 * DocumentId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 * 
 * Represents a unique identifier for a document.
 * Value objects are immutable and equality is based on value, not identity.
 */

export class DocumentId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('DocumentId cannot be empty');
    }
    this.value = value;
  }

  /**
   * Create a new DocumentId from a string value
   */
  static create(value: string): DocumentId {
    return new DocumentId(value);
  }

  /**
   * Generate a new unique DocumentId
   */
  static generate(): DocumentId {
    return new DocumentId(crypto.randomUUID());
  }

  /**
   * Get the string value of the DocumentId
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Check equality with another DocumentId
   */
  equals(other: DocumentId): boolean {
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
