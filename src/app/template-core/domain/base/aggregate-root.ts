import { TemplateDomainEvent } from './domain-event';
import { TemplateEntity } from './entity';

export abstract class TemplateAggregateRoot<T> extends TemplateEntity<T> {
  private _domainEvents: TemplateDomainEvent[] = [];
  private _version: number = 0;

  get version(): number {
    return this._version;
  }

  get domainEvents(): TemplateDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: TemplateDomainEvent): void {
    this._domainEvents.push(event);
    this.apply(event);
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  public loadFromHistory(history: TemplateDomainEvent[]): void {
    history.forEach(event => {
      this.apply(event);
      this._version = event.metadata.version || (this._version + 1);
    });
  }

  protected abstract apply(event: TemplateDomainEvent): void;
}
