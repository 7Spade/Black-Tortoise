import { TemplateDomainEvent } from '@template-core/domain/base/domain-event';

export class TemplateCreatedEvent extends TemplateDomainEvent {
  constructor(
    aggregateId: string,
    public readonly name: string,
    public readonly content: string,
    metadata?: any
  ) {
    super(aggregateId, 'TemplateCreatedEvent', metadata);
  }
}

export class TemplateContentUpdatedEvent extends TemplateDomainEvent {
  constructor(
    aggregateId: string,
    public readonly newContent: string,
    metadata?: any
  ) {
    super(aggregateId, 'TemplateContentUpdatedEvent', metadata);
  }
}

export class TemplateSectionAddedEvent extends TemplateDomainEvent {
  constructor(
    aggregateId: string,
    public readonly sectionId: string,
    public readonly title: string,
    public readonly content: string,
    public readonly orderIndex: number,
    metadata?: any
  ) {
    super(aggregateId, 'TemplateSectionAddedEvent', metadata);
  }
}

export class TemplateSectionRemovedEvent extends TemplateDomainEvent {
  constructor(
    aggregateId: string,
    public readonly sectionId: string,
    metadata?: any
  ) {
    super(aggregateId, 'TemplateSectionRemovedEvent', metadata);
  }
}
