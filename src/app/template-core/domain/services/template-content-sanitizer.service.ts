// Domain Service Example
// Encapsulates logic that doesn't naturally fit into an Entity or Value Object
// E.g. interacting with an external content filter (simulation)

export class TemplateContentSanitizerService {
  public sanitize(content: string): string {
    if (!content) return '';
    
    // Simulate removing script tags or unsafe HTML
    return content
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
      .trim();
  }
}
