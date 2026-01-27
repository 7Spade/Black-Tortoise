/**
 * Role Naming Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 * 
 * Enforces business rules for role naming
 */

export class RoleNamingPolicy {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 30;
  private static readonly RESERVED_NAMES = ['owner', 'admin', 'member', 'viewer'];

  /**
   * Check if role name satisfies policy
   */
  public static isSatisfiedBy(name: string): boolean {
    if (!name) return false;

    const trimmed = name.trim();
    if (trimmed.length < this.MIN_LENGTH) return false;
    if (trimmed.length > this.MAX_LENGTH) return false;

    const lower = trimmed.toLowerCase();
    return !this.RESERVED_NAMES.includes(lower);
  }

  /**
   * Assert role name is valid (throws on violation)
   */
  public static assertIsValid(name: string): void {
    if (!name) {
      throw new Error('Role name is required');
    }

    const trimmed = name.trim();

    if (trimmed.length < this.MIN_LENGTH) {
      throw new Error(
        `Role name must be at least ${this.MIN_LENGTH} characters (got ${trimmed.length})`
      );
    }

    if (trimmed.length > this.MAX_LENGTH) {
      throw new Error(
        `Role name must not exceed ${this.MAX_LENGTH} characters (got ${trimmed.length})`
      );
    }

    const lower = trimmed.toLowerCase();
    if (this.RESERVED_NAMES.includes(lower)) {
      throw new Error(
        `Role name "${name}" is reserved. Reserved names: ${this.RESERVED_NAMES.join(', ')}`
      );
    }
  }
}
