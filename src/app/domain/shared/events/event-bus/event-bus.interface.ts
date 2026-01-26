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

import { DomainEvent } from '../domain-event';

export type EventHandler<T extends DomainEvent<TPayload>, TPayload = unknown> = (event: T) => void | Promise<void>;

export interface EventBus {
  /**
   * Publish a domain event to all subscribers (Event Flow)
   */
  publish<TPayload>(event: DomainEvent<TPayload>): Promise<void>;

  /**
   * Publish multiple events (Batch Publishing)
   */
  publishBatch<TPayload>(events: DomainEvent<TPayload>[]): Promise<void>;

  /**
   * Subscribe to events of a specific type (Type-based filtering)
   */
  subscribe<TPayload>(
    eventType: string,
    handler: EventHandler<DomainEvent<TPayload>, TPayload>
  ): () => void; // Returns unsubscribe function

  /**
   * Subscribe to all events (Global event listener)
   */
  subscribeAll<TPayload>(handler: EventHandler<DomainEvent<TPayload>, TPayload>): () => void;

  /**
   * Unsubscribe a handler from an event type
   */
  unsubscribe<TPayload>(eventType: string, handler: EventHandler<DomainEvent<TPayload>, TPayload>): void;

  /**
   * Clear all subscriptions (Cleanup)
   */
  clear(): void;
}
