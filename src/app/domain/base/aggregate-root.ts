import { DomainEvent } from '@domain/events/domain-event';
import { Entity } from './entity';

/**
 * Aggregate Root Base Class
 * 
 * Layer: Domain
 * Purpose: Base class for Aggregate Roots.
 * Manages consistency boundaries and domain events.
 * 
 * Capability:
 * - Domain Event Collection (Event Sourcing precursor)
 * - Consistency Enforcement
 */

export abstract class AggregateRoot<TId> extends Entity<TId> {
    private _domainEvents: DomainEvent<any>[] = [];

    get domainEvents(): ReadonlyArray<DomainEvent<any>> {
        return this._domainEvents;
    }

    protected addDomainEvent(event: DomainEvent<any>): void {
        this._domainEvents.push(event);
    }

    public pullDomainEvents(): DomainEvent<any>[] {
        const events = this._domainEvents;
        this._domainEvents = [];
        return events;
    }

    public clearDomainEvents(): void {
        this._domainEvents = [];
    }
}
