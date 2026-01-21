/**
 * MembershipId is a branded identifier for membership entities.
 */
export class MembershipId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): MembershipId {
    if (!value || value.trim().length === 0) {
      throw new Error('MembershipId cannot be empty');
    }
    return new MembershipId(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: MembershipId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
