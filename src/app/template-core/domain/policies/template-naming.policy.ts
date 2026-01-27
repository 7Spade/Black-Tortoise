export class TemplateNamingPolicy {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 100;
  private static readonly FORBIDDEN_WORDS = ['admin', 'root', 'system'];

  public static isSatisfiedBy(name: string): boolean {
    if (!name) return false;
    
    const trimmedName = name.trim();
    
    if (trimmedName.length < this.MIN_LENGTH) return false;
    if (trimmedName.length > this.MAX_LENGTH) return false;
    
    const lowerName = trimmedName.toLowerCase();
    return !this.FORBIDDEN_WORDS.some(word => lowerName.includes(word));
  }

  public static assertIsValid(name: string): void {
    if (!this.isSatisfiedBy(name)) {
      throw new Error(`Invalid template name: "${name}". Must be between ${this.MIN_LENGTH}-${this.MAX_LENGTH} chars and not contain forbidden words.`);
    }
  }
}
