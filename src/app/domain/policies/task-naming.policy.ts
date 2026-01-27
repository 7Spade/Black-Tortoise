/**
 * Task Naming Policy
 *
 * Layer: Domain
 * DDD Pattern: Policy
 *
 * Encapsulates business rules for task title validation.
 */

export class TaskNamingPolicy {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 200;

  /**
   * Check if title satisfies naming policy
   */
  public static isSatisfiedBy(title: string): boolean {
    if (!title) return false;

    const trimmed = title.trim();
    return (
      trimmed.length >= this.MIN_LENGTH &&
      trimmed.length <= this.MAX_LENGTH
    );
  }

  /**
   * Assert that title is valid, throw if not
   */
  public static assertIsValid(title: string): void {
    if (!this.isSatisfiedBy(title)) {
      throw new Error(
        `Task title must be ${this.MIN_LENGTH}-${this.MAX_LENGTH} characters`,
      );
    }
  }
}
