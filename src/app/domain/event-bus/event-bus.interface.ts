/**
 * EventBus Interface
 * 
 * Layer: Domain
 * DDD Pattern: Event Bus Interface
 * 
 * Defines the contract for publishing and subscribing to domain events.
 * Enables event-driven architecture within the domain layer.
 */

import { DomainEvent } from '../event-store/event-store.interface';

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void | Promise<void>;

export interface EventBus {
  /**
   * Publish a domain event to all subscribers
   */
  publish(event: DomainEvent): Promise<void>;

  /**
   * Publish multiple events
   */
  publishBatch(events: DomainEvent[]): Promise<void>;

  /**
   * Subscribe to events of a specific type
   */
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): () => void; // Returns unsubscribe function

  /**
   * Subscribe to all events
   */
  subscribeAll(handler: EventHandler): () => void;

  /**
   * Unsubscribe a handler from an event type
   */
  unsubscribe(eventType: string, handler: EventHandler): void;

  /**
   * Clear all subscriptions
   */
  clear(): void;
}
