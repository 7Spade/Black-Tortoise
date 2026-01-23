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
 * - Query events by aggregate, workspace, causality, type, time range
 * - Support for batch operations
 * 
 * Implementation Note:
 * This is a PURE interface. Concrete implementations belong in Infrastructure layer.
 */

import { DomainEvent } from '../event/domain-event';

export interface EventStore {
  /**
   * Append an event to the event store (Event Sourcing)
   */
  append(event: DomainEvent): Promise<void>;

  /**
   * Append multiple events atomically
   */
  appendBatch(events: DomainEvent[]): Promise<void>;

  /**
   * Get all events for a specific aggregate (Reconstitute aggregate state)
   */
  getEventsForAggregate(aggregateId: string): Promise<DomainEvent[]>;

  /**
   * Get events for a specific workspace (Multi-tenancy)
   */
  getEventsForWorkspace(workspaceId: string): Promise<DomainEvent[]>;

  /**
   * Get events after a specific timestamp (Incremental sync)
   */
  getEventsSince(timestamp: Date): Promise<DomainEvent[]>;

  /**
   * Get events for a specific causality chain (Causality Tracking)
   */
  getEventsByCausality(causalityId: string): Promise<DomainEvent[]>;

  /**
   * Get all events of a specific type (Event Type filtering)
   */
  getEventsByType(eventType: string): Promise<DomainEvent[]>;

  /**
   * Get events within a time range (Time-based queries)
   */
  getEventsInRange(startTime: Date, endTime: Date): Promise<DomainEvent[]>;
}
