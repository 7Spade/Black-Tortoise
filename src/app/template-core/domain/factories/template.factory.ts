// Factory Pattern Example
// Encapsulates complex creation logic, often involving policies or external dependencies
import { Template } from '@template-core/domain/aggregates/template.aggregate';
import { TemplateNamingPolicy } from '@template-core/domain/policies/template-naming.policy';

export class TemplateFactory {
  public static createValidTemplate(name: string, content: string, metadata?: { correlationId?: string, causationId?: string, userId?: string }): Template {
    // Enforce Policy before creation
    TemplateNamingPolicy.assertIsValid(name);
    
    // Create Aggregate via its static method which generates the Domain Event
    // Pass metadata for Causality Tracking
    return Template.create(name, content, metadata);
  }
}
