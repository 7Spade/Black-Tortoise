import { Inject, Injectable } from '@angular/core';
import { TemplateDomainEvent } from '@template-core/domain/base/domain-event';
import { ITemplateEventStore } from '@template-core/application/ports/event-store.port';
import { GetTemplateHistoryQuery } from '@template-core/application/queries/get-template-history.query';
import { TEMPLATE_EVENT_STORE_TOKEN } from '@template-core/application/tokens/event-infrastructure.tokens';

@Injectable({ providedIn: 'root' })
export class GetTemplateHistoryUseCase {
  constructor(
    @Inject(TEMPLATE_EVENT_STORE_TOKEN) private eventStore: ITemplateEventStore
  ) {}

  async execute(query: GetTemplateHistoryQuery): Promise<TemplateDomainEvent[]> {
    return this.eventStore.load(query.templateId);
  }
}
