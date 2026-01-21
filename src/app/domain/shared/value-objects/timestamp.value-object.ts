/**
 * Timestamp is a value object wrapping Date with domain semantics.
 */
export class Timestamp {
  private readonly value: Date;

  private constructor(value: Date) {
    this.value = value;
  }

  static create(value: Date | string | number): Timestamp {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid timestamp');
    }
    return new Timestamp(date);
  }

  static now(): Timestamp {
    return new Timestamp(new Date());
  }

  getValue(): Date {
    return new Date(this.value);
  }

  equals(other: Timestamp): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  isBefore(other: Timestamp): boolean {
    return this.value.getTime() < other.value.getTime();
  }

  isAfter(other: Timestamp): boolean {
    return this.value.getTime() > other.value.getTime();
  }

  toString(): string {
    return this.value.toISOString();
  }
}
