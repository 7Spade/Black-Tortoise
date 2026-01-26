/**
 * DailyEntryId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class DailyEntryId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('DailyEntry ID cannot be empty');
    }
    this.value = value;
  }

  public static create(id: string): DailyEntryId {
    return new DailyEntryId(id);
  }

  public static generate(): DailyEntryId {
    return new DailyEntryId(crypto.randomUUID());
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: DailyEntryId): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
