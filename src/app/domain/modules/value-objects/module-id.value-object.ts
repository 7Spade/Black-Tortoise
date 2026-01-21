/**
 * ModuleId is a branded identifier for module entities.
 */
export class ModuleId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): ModuleId {
    if (!value || value.trim().length === 0) {
      throw new Error('ModuleId cannot be empty');
    }
    return new ModuleId(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ModuleId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
