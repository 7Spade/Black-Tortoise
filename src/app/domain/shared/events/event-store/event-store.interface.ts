/**
 * EventStore Interface
 * 
 * Layer: Domain
 * DDD Pattern: Repository Interface for Events
 * 
 * Event Store Pattern:
 * Defines the contract for persisting and retrieving domain events.
 * This interface is implemented in the infrastructure layer.
 * 
 * Event Sourcing Capabilities:
 * - Append events (write-only, immutable)
 * - Query events by aggregate, causality, type, time range
 * - Support for batch operations
 * 
 * Implementation Note:
 * This is a PURE interface. Concrete implementations belong in Infrastructure layer.
 */

import { DomainEvent } from '../domain-event';

export interface EventStore {
  /**
   * Append an event to the event store (Event Sourcing)
   */
  append<TPayload>(event: DomainEvent<TPayload>): Promise<void>;

  /**
   * Append multiple events atomically
   */
  appendBatch<TPayload>(events: DomainEvent<TPayload>[]): Promise<void>;

  /**
   * Get all events for a specific aggregate (Reconstitute aggregate state)
   */
  getEventsForAggregate<TPayload>(aggregateId: string): Promise<DomainEvent<TPayload>[]>;

  /**
   * Get events after a specific timestamp (Incremental sync)
   */
  getEventsSince<TPayload>(timestamp: number): Promise<DomainEvent<TPayload>[]>;

  /**
   * Get events for a specific causality chain (Causality Tracking)
   */
  getEventsByCausality<TPayload>(correlationId: string): Promise<DomainEvent<TPayload>[]>;

  /**
   * Get all events of a specific type (Event Type filtering)
   */
  getEventsByType<TPayload>(eventType: string): Promise<DomainEvent<TPayload>[]>;

  /**
   * Get events within a time range (Time-based queries)
   */
  getEventsInRange<TPayload>(startTime: number, endTime: number): Promise<DomainEvent<TPayload>[]>;
}
