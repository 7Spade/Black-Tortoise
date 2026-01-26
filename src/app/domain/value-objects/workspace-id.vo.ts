/**
 * WorkspaceId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 * 
 * Represents a workspace identifier with validation.
 */
export class WorkspaceId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Workspace ID cannot be empty');
    }
    this.value = value;
  }

  public static create(id: string): WorkspaceId {
    return new WorkspaceId(id);
  }

  public static generate(): WorkspaceId {
    return new WorkspaceId(crypto.randomUUID());
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: WorkspaceId): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
