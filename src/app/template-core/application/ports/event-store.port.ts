import { TemplateDomainEvent } from '../../domain/base/domain-event';

export interface ITemplateEventStore {
  save(events: TemplateDomainEvent[]): Promise<void>;
  load(aggregateId: string): Promise<TemplateDomainEvent[]>;
}
