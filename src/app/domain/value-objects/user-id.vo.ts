/**
 * UserId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class UserId {
  public readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
    this.value = value;
  }

  public static create(id: string): UserId {
    return new UserId(id);
  }

  public static generate(): UserId {
    return new UserId(crypto.randomUUID());
  }

  public getValue(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: UserId): boolean {
    if (!other) return false;
    return this.value === other.value;
  }
}
