/**
 * IdentityId is a branded identifier for identity entities.
 */
export class IdentityId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): IdentityId {
    if (!value || value.trim().length === 0) {
      throw new Error('IdentityId cannot be empty');
    }
    return new IdentityId(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: IdentityId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
