/**
 * Timestamp Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 * 
 * Enforces consistent time handling (UTC Epoch).
 */
export class Timestamp {
  private readonly value: number;

  private constructor(value: number) {
    if (value < 0 || isNaN(value)) {
      throw new Error('Invalid timestamp');
    }
    this.value = value;
  }

  public static create(timestamp: number): Timestamp {
    return new Timestamp(timestamp);
  }

  public static now(): Timestamp {
    return new Timestamp(Date.now());
  }

  public static fromDate(date: Date): Timestamp {
    return new Timestamp(date.getTime());
  }

  public getValue(): number {
    return this.value;
  }

  public toDate(): Date {
    return new Date(this.value);
  }

  public equals(other: Timestamp): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public isBefore(other: Timestamp): boolean {
    return this.value < other.value;
  }

  public isAfter(other: Timestamp): boolean {
    return this.value > other.value;
  }
}
