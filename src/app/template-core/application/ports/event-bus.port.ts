import { TemplateDomainEvent } from '../../domain/base/domain-event';

export interface ITemplateEventBus {
  publish(events: TemplateDomainEvent[]): Promise<void>;
}
