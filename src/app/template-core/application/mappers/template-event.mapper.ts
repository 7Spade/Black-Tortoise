import { TemplateDomainEvent } from '../../domain/base/domain-event';
import { TemplateEventDto } from '../dtos/template-event.dto';

export class TemplateEventMapper {
  static toDto(event: TemplateDomainEvent): TemplateEventDto {
    return {
      eventId: event.eventId,
      eventName: event.eventName,
      aggregateId: event.aggregateId,
      occurredOn: event.occurredOn.toLocaleString(),
      description: this.getDescription(event),
      metadata: {
        correlationId: event.metadata.correlationId,
        causationId: event.metadata.causationId,
        userId: event.metadata.userId,
        version: event.metadata.version
      }
    };
  }

  static toDtoList(events: TemplateDomainEvent[]): TemplateEventDto[] {
    return events.map(e => this.toDto(e)).sort((a, b) => 
      new Date(b.occurredOn).getTime() - new Date(a.occurredOn).getTime()
    ); // Descending order
  }

  private static getDescription(event: TemplateDomainEvent): string {
    const anyEvent = event as any;
    switch (event.eventName) {
      case 'TemplateCreatedEvent':
        return `Created template '${anyEvent.name}'`;
      case 'TemplateContentUpdatedEvent':
        return `Updated content`;
      case 'TemplateSectionAddedEvent':
        return `Added section '${anyEvent.title}'`;
      case 'TemplateSectionRemovedEvent':
        return `Removed section '${anyEvent.sectionId}'`;
      default:
        return event.eventName;
    }
  }
}
