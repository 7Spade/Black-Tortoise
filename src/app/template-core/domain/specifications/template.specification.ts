// Specification Pattern Example
// Used to encapsulate complex business rules that can be tested in isolation
import { Template } from '@template-core/domain/aggregates/template.aggregate';

export abstract class TemplateSpecification {
  abstract isSatisfiedBy(template: Template): boolean;
}

export class TemplateIsRecentSpecification extends TemplateSpecification {
  constructor(private readonly thresholdInDays: number = 7) {
    super();
  }

  isSatisfiedBy(template: Template): boolean {
    const primitives = template.toPrimitives();
    const diff = Date.now() - primitives.createdAt.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days <= this.thresholdInDays;
  }
}
