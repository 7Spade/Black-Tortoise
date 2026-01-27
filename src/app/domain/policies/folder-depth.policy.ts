/**
 * Folder Depth Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 * 
 * Enforces maximum folder depth to prevent excessive nesting.
 * Pure business logic - no framework dependencies.
 */

export class FolderDepthPolicy {
  private static readonly MAX_DEPTH = 10;

  /**
   * Check if depth is within limits
   */
  static isSatisfiedBy(depth: number): boolean {
    return depth >= 0 && depth < this.MAX_DEPTH;
  }

  /**
   * Assert depth is valid, throw error otherwise
   */
  static assertIsValid(depth: number, operation: string = 'create'): void {
    if (depth < 0) {
      throw new Error('Folder depth cannot be negative');
    }

    if (depth >= this.MAX_DEPTH) {
      throw new Error(
        `Cannot ${operation} folder: maximum depth of ${this.MAX_DEPTH} levels would be exceeded`
      );
    }
  }

  /**
   * Get maximum allowed depth
   */
  static getMaxDepth(): number {
    return this.MAX_DEPTH;
  }
}
