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
 * - Stores events in memory array
 * - Supports all query patterns from EventStore interface
 * - No persistence across restarts
 */

import { EventStore } from '@domain/event-store/event-store.interface';
import { DomainEvent } from '@domain/event/domain-event';

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
      .filter(e => e.correlationId === causalityId || e.causationId === causalityId)
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
