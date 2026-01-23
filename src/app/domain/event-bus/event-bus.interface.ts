/**
 * EventBus Interface
 * 
 * Layer: Domain
 * DDD Pattern: Event Bus Interface
 * 
 * Event Flow Pattern:
 * Defines the contract for publishing and subscribing to domain events.
 * Enables event-driven architecture within the domain layer.
 * 
 * Event Bus vs Event Store:
 * - Event Bus: Real-time event distribution (pub/sub)
 * - Event Store: Persistent event history (append-only log)
 * 
 * Event Lifecycle:
 * 1. Event is created in aggregate
 * 2. Event is published to bus (real-time notification)
 * 3. Event is appended to store (persistence)
 * 4. Subscribers react to event
 * 
 * Implementation Note:
 * This is a PURE interface. Concrete implementations belong in Infrastructure layer.
 */

import { DomainEvent } from '../event/domain-event';

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void | Promise<void>;

export interface EventBus {
  /**
   * Publish a domain event to all subscribers (Event Flow)
   */
  publish(event: DomainEvent): Promise<void>;

  /**
   * Publish multiple events (Batch Publishing)
   */
  publishBatch(events: DomainEvent[]): Promise<void>;

  /**
   * Subscribe to events of a specific type (Type-based filtering)
   */
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): () => void; // Returns unsubscribe function

  /**
   * Subscribe to all events (Global event listener)
   */
  subscribeAll(handler: EventHandler): () => void;

  /**
   * Unsubscribe a handler from an event type
   */
  unsubscribe(eventType: string, handler: EventHandler): void;

  /**
   * Clear all subscriptions (Cleanup)
   */
  clear(): void;
}
