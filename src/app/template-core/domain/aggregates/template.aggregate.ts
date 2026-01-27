import { TemplateAggregateRoot } from '../base/aggregate-root';
import { TemplateDomainEvent } from '../base/domain-event';
import { TemplateSection } from '../entities/template-section.entity';
import { TemplateContentUpdatedEvent, TemplateCreatedEvent, TemplateSectionAddedEvent, TemplateSectionRemovedEvent } from '../events/template.events';
import { SectionId } from '../value-objects/section-id.vo';
import { TemplateId } from '../value-objects/template-id.vo';

export interface TemplateProps {
  id: TemplateId;
  name: string;
  content: string;
  sections: { id: string, title: string, content: string, orderIndex: number }[];
  createdAt: Date;
  updatedAt: Date;
}

export class Template extends TemplateAggregateRoot<TemplateId> {
  private _name!: string;
  private _content!: string;
  private _createdAt!: Date;
  private _updatedAt!: Date;
  private _sections: TemplateSection[] = [];

  private constructor(id: TemplateId) {
    super(id);
  }

  // Accepts optional metadata to support Causality Tracking (traceId/userId from Command)
  public static create(name: string, content: string, metadata?: { correlationId?: string, causationId?: string, userId?: string }): Template {
    const id = TemplateId.create();
    const template = new Template(id);
    
    template.addDomainEvent(new TemplateCreatedEvent(
      id.value,
      name,
      content,
      { 
        correlationId: metadata?.correlationId,
        causationId: metadata?.causationId,
        userId: metadata?.userId 
      }
    ));

    return template;
  }

  // Used for Event Sourcing Rehydration
  public static load(id: TemplateId, history: TemplateDomainEvent[]): Template {
    const template = new Template(id);
    template.loadFromHistory(history);
    return template;
  }

  // Used for snapshot reconstruction
  public static reconstruct(props: TemplateProps): Template {
    const template = new Template(props.id);
    template._name = props.name;
    template._content = props.content;
    template._createdAt = props.createdAt;
    template._updatedAt = props.updatedAt;
    template._sections = props.sections.map(s => new TemplateSection(
        SectionId.from(s.id),
        s.title,
        s.content,
        s.orderIndex
    ));
    return template;
  }

  // Getters
  get name(): string { return this._name; }
  get content(): string { return this._content; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Business Logic Methods
  public updateContent(newContent: string, metadata?: { correlationId?: string, causationId?: string, userId?: string }): void {
    if (!newContent) {
      throw new Error('Content cannot be empty');
    }
    
    this.addDomainEvent(new TemplateContentUpdatedEvent(
      this.id.value,
      newContent,
      metadata // Pass causality metadata
    ));
  }

  public addSection(title: string, content: string, metadata?: { correlationId?: string, causationId?: string, userId?: string }): void {
    if (this._sections.some(s => s.title === title)) {
      throw new Error('Section title must be unique within the template');
    }

    const sectionId = SectionId.create();
    const orderIndex = this._sections.length;

    this.addDomainEvent(new TemplateSectionAddedEvent(
      this.id.value,
      sectionId.value,
      title,
      content,
      orderIndex,
      metadata
    ));
  }

  public removeSection(sectionId: string, metadata?: { correlationId?: string, causationId?: string, userId?: string }): void {
    if (!this._sections.some(s => s.id.value === sectionId)) {
        throw new Error('Section not found');
    }
    this.addDomainEvent(new TemplateSectionRemovedEvent(
        this.id.value,
        sectionId,
        metadata
    ));
  }

  protected apply(event: TemplateDomainEvent): void {
    // Robust check for both Class Instances and Plain Objects (rehydrated)
    const eventName = event.eventName;

    switch (eventName) {
      case 'TemplateCreatedEvent':
        const createdEvent = event as TemplateCreatedEvent;
        this._name = createdEvent.name;
        this._content = createdEvent.content;
        this._createdAt = new Date(createdEvent.occurredOn);
        this._updatedAt = new Date(createdEvent.occurredOn);
        this._sections = []; 
        break;
      
      case 'TemplateContentUpdatedEvent':
        const updatedEvent = event as TemplateContentUpdatedEvent;
        this._content = updatedEvent.newContent;
        this._updatedAt = new Date(updatedEvent.occurredOn);
        break;

      case 'TemplateSectionAddedEvent':
        const addSectionEvent = event as TemplateSectionAddedEvent;
        this._sections.push(new TemplateSection(
            SectionId.from(addSectionEvent.sectionId),
            addSectionEvent.title,
            addSectionEvent.content,
            addSectionEvent.orderIndex
        ));
        this._updatedAt = new Date(addSectionEvent.occurredOn);
        break;

      case 'TemplateSectionRemovedEvent':
        const removeSectionEvent = event as TemplateSectionRemovedEvent;
        this._sections = this._sections.filter(s => s.id.value !== removeSectionEvent.sectionId);
        this._updatedAt = new Date(removeSectionEvent.occurredOn);
        break;
    }
  }

  public toPrimitives(): TemplateProps {
      return {
          id: this.id,
          name: this.name,
          content: this.content,
          sections: this._sections.map(s => ({ 
              id: s.id.value, 
              title: s.title, 
              content: s.content, 
              orderIndex: s.orderIndex 
          })),
          createdAt: this.createdAt,
          updatedAt: this.updatedAt
      };
  }
}
