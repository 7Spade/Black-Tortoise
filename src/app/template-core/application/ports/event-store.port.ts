import { TemplateDomainEvent } from '@template-core/domain/base/domain-event';

export interface ITemplateEventStore {
  save(events: TemplateDomainEvent[]): Promise<void>;
  load(aggregateId: string): Promise<TemplateDomainEvent[]>;
}
