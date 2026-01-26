/**
 * MemberId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class MemberId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Member ID cannot be empty');
    }
    this.value = value;
  }

  public static create(id: string): MemberId {
    return new MemberId(id);
  }

  public static generate(): MemberId {
    return new MemberId(crypto.randomUUID());
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: MemberId): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
