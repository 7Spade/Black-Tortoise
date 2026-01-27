/**
 * Document Naming Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 * 
 * Enforces document naming conventions and validation rules.
 * Pure business logic - no framework dependencies.
 */

export class DocumentNamingPolicy {
  private static readonly MAX_NAME_LENGTH = 255;
  private static readonly MIN_NAME_LENGTH = 1;
  private static readonly FORBIDDEN_CHARS = /[<>:"/\\|?*\x00-\x1F]/;
  private static readonly RESERVED_NAMES = new Set([
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
  ]);

  /**
   * Check if name satisfies policy
   */
  static isSatisfiedBy(name: string): boolean {
    if (!name || name.trim().length === 0) return false;
    
    const trimmed = name.trim();
    
    if (trimmed.length < this.MIN_NAME_LENGTH) return false;
    if (trimmed.length > this.MAX_NAME_LENGTH) return false;
    if (this.FORBIDDEN_CHARS.test(trimmed)) return false;
    
    // Check reserved names (case-insensitive, without extension)
    const baseName = trimmed.split('.')[0]?.toUpperCase() || '';
    if (this.RESERVED_NAMES.has(baseName)) return false;
    
    return true;
  }

  /**
   * Assert name is valid, throw error otherwise
   */
  static assertIsValid(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Document name cannot be empty');
    }

    const trimmed = name.trim();

    if (trimmed.length < this.MIN_NAME_LENGTH) {
      throw new Error(`Document name must be at least ${this.MIN_NAME_LENGTH} character`);
    }

    if (trimmed.length > this.MAX_NAME_LENGTH) {
      throw new Error(`Document name cannot exceed ${this.MAX_NAME_LENGTH} characters`);
    }

    if (this.FORBIDDEN_CHARS.test(trimmed)) {
      throw new Error('Document name contains forbidden characters: < > : " / \\ | ? *');
    }

    const baseName = trimmed.split('.')[0]?.toUpperCase() || '';
    if (this.RESERVED_NAMES.has(baseName)) {
      throw new Error(`Document name "${baseName}" is reserved by the system`);
    }
  }
}
