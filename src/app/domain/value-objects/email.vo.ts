/**
 * Email Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 * 
 * Represents a valid email address.
 */
export class Email {
  private readonly value: string;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(value: string) {
    if (!Email.EMAIL_REGEX.test(value)) {
      throw new Error('Invalid email format');
    }
    this.value = value.toLowerCase();
  }

  public static create(email: string): Email {
    return new Email(email);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
