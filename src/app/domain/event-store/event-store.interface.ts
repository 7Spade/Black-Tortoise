/**
 * EventStore Interface
 * 
 * Layer: Domain
 * DDD Pattern: Event Store Interface
 * 
 * Defines the contract for persisting and retrieving domain events.
 * This interface is implemented in the infrastructure layer.
 */

export interface DomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly workspaceId: string;
  readonly timestamp: Date;
  readonly causalityId: string;
  readonly payload: Record<string, unknown>;
  readonly metadata: {
    readonly version: number;
    readonly userId?: string;
    readonly correlationId?: string;
  };
}

export interface EventStore {
  /**
   * Append an event to the event store
   */
  append(event: DomainEvent): Promise<void>;

  /**
   * Append multiple events atomically
   */
  appendBatch(events: DomainEvent[]): Promise<void>;

  /**
   * Get all events for a specific aggregate
   */
  getEventsForAggregate(aggregateId: string): Promise<DomainEvent[]>;

  /**
   * Get events for a specific workspace
   */
  getEventsForWorkspace(workspaceId: string): Promise<DomainEvent[]>;

  /**
   * Get events after a specific timestamp
   */
  getEventsSince(timestamp: Date): Promise<DomainEvent[]>;

  /**
   * Get events for a specific causality chain
   */
  getEventsByCausality(causalityId: string): Promise<DomainEvent[]>;

  /**
   * Get all events of a specific type
   */
  getEventsByType(eventType: string): Promise<DomainEvent[]>;

  /**
   * Get events within a time range
   */
  getEventsInRange(startTime: Date, endTime: Date): Promise<DomainEvent[]>;
}
