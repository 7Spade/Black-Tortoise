/**
 * QCCheckId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class QCCheckId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('QCCheck ID cannot be empty');
    }
    this.value = value;
  }

  public static create(id: string): QCCheckId {
    return new QCCheckId(id);
  }

  public static generate(): QCCheckId {
    return new QCCheckId(crypto.randomUUID());
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: QCCheckId): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
