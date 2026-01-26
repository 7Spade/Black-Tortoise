/**
 * IssueId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class IssueId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Issue ID cannot be empty');
    }
    this.value = value;
  }

  public static create(id: string): IssueId {
    return new IssueId(id);
  }

  public static generate(): IssueId {
    return new IssueId(crypto.randomUUID());
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: IssueId): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
