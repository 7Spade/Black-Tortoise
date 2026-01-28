import { TemplateDomainEvent } from '@template-core/domain/base/domain-event';

export interface ITemplateEventBus {
  publish(events: TemplateDomainEvent[]): Promise<void>;
}
