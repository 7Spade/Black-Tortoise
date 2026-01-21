/**
 * Id is a branded value object ensuring type-safe unique identifiers.
 */
export class Id {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Id {
    if (!value || value.trim().length === 0) {
      throw new Error('Id cannot be empty');
    }
    return new Id(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Id): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
