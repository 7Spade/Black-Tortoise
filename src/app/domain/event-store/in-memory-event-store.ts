/**
 * InMemoryEventStore
 * 
 * Layer: Domain
 * DDD Pattern: Event Store Implementation (for testing)
 * 
 * In-memory implementation of the EventStore interface for testing and development.
 * This should NOT be used in production - use a real event store implementation
 * from the infrastructure layer instead.
 */

import { EventStore, DomainEvent } from './event-store.interface';

export class InMemoryEventStore implements EventStore {
  private events: DomainEvent[] = [];

  /**
   * Append an event to the store
   */
  async append(event: DomainEvent): Promise<void> {
    this.events.push(event);
  }

  /**
   * Append multiple events atomically
   */
  async appendBatch(events: DomainEvent[]): Promise<void> {
    this.events.push(...events);
  }

  /**
   * Get all events for a specific aggregate
   */
  async getEventsForAggregate(aggregateId: string): Promise<DomainEvent[]> {
    return this.events
      .filter(e => e.aggregateId === aggregateId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Get events for a specific workspace
   */
  async getEventsForWorkspace(workspaceId: string): Promise<DomainEvent[]> {
    return this.events
      .filter(e => e.workspaceId === workspaceId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Get events after a specific timestamp
   */
  async getEventsSince(timestamp: Date): Promise<DomainEvent[]> {
    return this.events
      .filter(e => e.timestamp >= timestamp)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Get events for a specific causality chain
   */
  async getEventsByCausality(causalityId: string): Promise<DomainEvent[]> {
    return this.events
      .filter(e => e.causalityId === causalityId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Get all events of a specific type
   */
  async getEventsByType(eventType: string): Promise<DomainEvent[]> {
    return this.events
      .filter(e => e.eventType === eventType)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Get events within a time range
   */
  async getEventsInRange(startTime: Date, endTime: Date): Promise<DomainEvent[]> {
    return this.events
      .filter(e => e.timestamp >= startTime && e.timestamp <= endTime)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Clear all events (for testing)
   */
  clear(): void {
    this.events = [];
  }

  /**
   * Get total event count (for testing)
   */
  count(): number {
    return this.events.length;
  }
}
