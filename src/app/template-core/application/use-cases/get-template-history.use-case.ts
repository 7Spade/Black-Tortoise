import { Inject, Injectable } from '@angular/core';
import { TemplateDomainEvent } from '@template-core/domain/base/domain-event';
import { ITemplateEventStore } from '../ports/event-store.port';
import { GetTemplateHistoryQuery } from '../queries/get-template-history.query';
import { TEMPLATE_EVENT_STORE_TOKEN } from '../tokens/event-infrastructure.tokens';

@Injectable({ providedIn: 'root' })
export class GetTemplateHistoryUseCase {
  constructor(
    @Inject(TEMPLATE_EVENT_STORE_TOKEN) private eventStore: ITemplateEventStore
  ) {}

  async execute(query: GetTemplateHistoryQuery): Promise<TemplateDomainEvent[]> {
    return this.eventStore.load(query.templateId);
  }
}
