import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ITemplateEventBus } from '../../application/ports/event-bus.port';
import { TemplateDomainEvent } from '../../domain/base/domain-event';

@Injectable()
export class TemplateRxJsEventBus implements ITemplateEventBus {
  private eventStream = new Subject<TemplateDomainEvent>();

  // This simple bus just logs for the template.
  // In a real app, you'd integrate with internal handlers or external msg queues.
  async publish(events: TemplateDomainEvent[]): Promise<void> {
    events.forEach(event => {
      console.log(`[TemplateRxJsEventBus] Publishing: ${event.eventName}`, event);
      this.eventStream.next(event);
    });
    return Promise.resolve();
  }
  
  // Method to subscribe (for Process Managers)
  asObservable() {
    return this.eventStream.asObservable();
  }
}
