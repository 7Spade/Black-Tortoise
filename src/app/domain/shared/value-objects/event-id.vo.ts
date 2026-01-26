/**
 * EventId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 * 
 * Represents a unique identifier for a domain event.
 * Value objects are immutable and equality is based on value, not identity.
 */

export class EventId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('EventId cannot be empty');
    }
    this.value = value;
  }

  /**
   * Create a new EventId from a string value
   */
  static create(value: string): EventId {
    return new EventId(value);
  }

  /**
   * Generate a new unique EventId
   */
  static generate(): EventId {
    return new EventId(crypto.randomUUID());
  }

  /**
   * Get the string value of the EventId
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Check equality with another EventId
   */
  equals(other: EventId): boolean {
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
