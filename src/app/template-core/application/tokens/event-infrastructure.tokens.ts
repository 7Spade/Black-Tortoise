import { InjectionToken } from '@angular/core';
import { ITemplateEventBus } from '../ports/event-bus.port';
import { ITemplateEventStore } from '../ports/event-store.port';

export const TEMPLATE_EVENT_STORE_TOKEN = new InjectionToken<ITemplateEventStore>('TEMPLATE_EVENT_STORE_TOKEN');
export const TEMPLATE_EVENT_BUS_TOKEN = new InjectionToken<ITemplateEventBus>('TEMPLATE_EVENT_BUS_TOKEN');
