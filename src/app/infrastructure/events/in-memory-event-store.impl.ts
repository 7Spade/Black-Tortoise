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
 */

import { EventStore } from '@domain/event-store/event-store.interface';
import { DomainEvent } from '@domain/event/domain-event';

export class InMemoryEventStore implements EventStore {
  private readonly events: DomainEvent[] = [];

  /**
   * Append an event to the store
   * Constitution: Append-only, immutable, replay-safe
   */
  async append(event: DomainEvent): Promise<void> {
    // Freeze event to ensure immutability
    const frozenEvent = Object.freeze({ ...event });
    this.events.push(frozenEvent);
  }

  /**
   * Append multiple events atomically
   * Constitution: Append-only, immutable, replay-safe
   */
  async appendBatch(events: DomainEvent[]): Promise<void> {
    const frozenEvents = events.map(e => Object.freeze({ ...e }));
    this.events.push(...frozenEvents);
  }

  /**
   * Get all events for a specific aggregate
   * Returns defensive copy for replay safety
   */
  async getEventsForAggregate(aggregateId: string): Promise<DomainEvent[]> {
    return this.events
      .filter(e => e.aggregateId === aggregateId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .map(e => ({ ...e })); // Defensive copy
  }

  /**
   * Get events for a specific workspace
   * Returns defensive copy for replay safety
   */
  async getEventsForWorkspace(workspaceId: string): Promise<DomainEvent[]> {
    return this.events
      .filter(e => e.workspaceId === workspaceId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .map(e => ({ ...e })); // Defensive copy
  }

  /**
   * Get events after a specific timestamp
   * Returns defensive copy for replay safety
   */
  async getEventsSince(timestamp: Date): Promise<DomainEvent[]> {
    return this.events
      .filter(e => e.timestamp >= timestamp)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .map(e => ({ ...e })); // Defensive copy
  }

  /**
   * Get events for a specific causality chain
   * Returns defensive copy for replay safety
   */
  async getEventsByCausality(causalityId: string): Promise<DomainEvent[]> {
    return this.events
      .filter(e => e.correlationId === causalityId || e.causationId === causalityId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .map(e => ({ ...e })); // Defensive copy
  }

  /**
   * Get all events of a specific type
   * Returns defensive copy for replay safety
   */
  async getEventsByType(eventType: string): Promise<DomainEvent[]> {
    return this.events
      .filter(e => e.eventType === eventType)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .map(e => ({ ...e })); // Defensive copy
  }

  /**
   * Get events within a time range
   * Returns defensive copy for replay safety
   */
  async getEventsInRange(startTime: Date, endTime: Date): Promise<DomainEvent[]> {
    return this.events
      .filter(e => e.timestamp >= startTime && e.timestamp <= endTime)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .map(e => ({ ...e })); // Defensive copy
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
