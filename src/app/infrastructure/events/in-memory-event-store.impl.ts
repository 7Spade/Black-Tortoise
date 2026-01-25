/**
 * InMemoryEventStore Implementation
 * 
 * Layer: Infrastructure
 * DDD Pattern: Event Store Concrete Implementation
 * 
 * Purpose: In-memory implementation of the EventStore interface for testing and development.
 * 
 * WARNING: This should NOT be used in production.
 * Use FirestoreEventStore or another persistent implementation instead.
 * 
 * Event Sourcing Implementation:
 * - Stores events in memory array (immutable, append-only)
 * - Supports all query patterns from EventStore interface
 * - No persistence across restarts
 * - Replay-safe: events are frozen on append
 * 
 * Constitution Compliance:
 * - Append-only (no delete/update methods)
 * - Immutable events (Object.freeze on append)
 * - Replay-safe (returns defensive copies)
 * 
 * DI Configuration:
 * - Provided via EVENT_STORE token in app.config.ts
 * - Singleton instance managed by Angular DI
 */

import { Injectable } from '@angular/core';
import { EventStore } from '@domain/event-store/event-store.interface';
import { DomainEvent } from '@domain/event/domain-event';

@Injectable()
export class InMemoryEventStore implements EventStore {
  private readonly events: DomainEvent<unknown>[] = [];

  /**
   * Append an event to the store
   * Constitution: Append-only, immutable, replay-safe
   */
  async append<TPayload>(event: DomainEvent<TPayload>): Promise<void> {
    // Freeze event to ensure immutability
    const frozenEvent = Object.freeze({ ...event });
    this.events.push(frozenEvent as DomainEvent<unknown>);
  }

  /**
   * Append multiple events atomically
   * Constitution: Append-only, immutable, replay-safe
   */
  async appendBatch<TPayload>(events: DomainEvent<TPayload>[]): Promise<void> {
    const frozenEvents = events.map(e => Object.freeze({ ...e }) as DomainEvent<unknown>);
    this.events.push(...frozenEvents);
  }

  /**
   * Get all events for a specific aggregate
   * Returns defensive copy for replay safety
   */
  async getEventsForAggregate<TPayload>(aggregateId: string): Promise<DomainEvent<TPayload>[]> {
    return this.events
      .filter(e => e.aggregateId === aggregateId)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(e => ({ ...e })) as DomainEvent<TPayload>[]; // Defensive copy
  }

  /**
   * Get events after a specific timestamp
   * Returns defensive copy for replay safety
   */
  async getEventsSince<TPayload>(timestamp: number): Promise<DomainEvent<TPayload>[]> {
    return this.events
      .filter(e => e.timestamp >= timestamp)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(e => ({ ...e })) as DomainEvent<TPayload>[]; // Defensive copy
  }

  /**
   * Get events for a specific causality chain
   * Returns defensive copy for replay safety
   */
  async getEventsByCausality<TPayload>(correlationId: string): Promise<DomainEvent<TPayload>[]> {
    return this.events
      .filter(e => e.correlationId === correlationId || e.causationId === correlationId)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(e => ({ ...e })) as DomainEvent<TPayload>[]; // Defensive copy
  }

  /**
   * Get all events of a specific type
   * Returns defensive copy for replay safety
   */
  async getEventsByType<TPayload>(eventType: string): Promise<DomainEvent<TPayload>[]> {
    return this.events
      .filter(e => e.type === eventType)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(e => ({ ...e })) as DomainEvent<TPayload>[]; // Defensive copy
  }

  /**
   * Get events within a time range
   * Returns defensive copy for replay safety
   */
  async getEventsInRange<TPayload>(startTime: number, endTime: number): Promise<DomainEvent<TPayload>[]> {
    return this.events
      .filter(e => e.timestamp >= startTime && e.timestamp <= endTime)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(e => ({ ...e })) as DomainEvent<TPayload>[]; // Defensive copy
  }

  /**
   * Clear all events (for testing only)
   */
  clear(): void {
    this.events.length = 0;
  }

  /**
   * Get total event count (for testing)
   */
  count(): number {
    return this.events.length;
  }
}
