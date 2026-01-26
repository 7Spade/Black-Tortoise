/**
 * AuditLogId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class AuditLogId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('AuditLog ID cannot be empty');
    }
    this.value = value;
  }

  public static create(id: string): AuditLogId {
    return new AuditLogId(id);
  }

  public static generate(): AuditLogId {
    return new AuditLogId(crypto.randomUUID());
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: AuditLogId): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
