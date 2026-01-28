/**
 * InMemoryEventBus Implementation
 * 
 * Layer: Infrastructure
 * DDD Pattern: Event Bus Concrete Implementation
 * 
 * Purpose: In-memory implementation of the EventBus interface.
 * Uses native Map/Set for event distribution (no RxJS dependency).
 * 
 * Event Flow Implementation:
 * - Synchronous event publishing
 * - Type-based and global subscriptions
 * - Automatic cleanup on unsubscribe
 * 
 * DI Configuration:
 * - Provided via EVENT_BUS token in app.config.ts
 * - Singleton instance managed by Angular DI
 * 
 * Note: For RxJS-based implementation, see in-memory-event-bus-rxjs.impl.ts
 */

import { Injectable } from '@angular/core';
import { DomainEvent } from '@eventing/domain/events';
import { EventBus, EventHandler } from '@eventing/domain/interfaces';

@Injectable()
export class InMemoryEventBus implements EventBus {
  private subscribers: Map<string, Set<EventHandler<DomainEvent<unknown>, unknown>>> = new Map();
  private globalSubscribers: Set<EventHandler<DomainEvent<unknown>, unknown>> = new Set();

  /**
   * Publish a domain event to all subscribers
   */
  async publish<TPayload>(event: DomainEvent<TPayload>): Promise<void> {
    // Notify type-specific subscribers
    const typeSubscribers = this.subscribers.get(event.type);
    if (typeSubscribers) {
      const promises = Array.from(typeSubscribers).map(handler =>
        Promise.resolve(handler(event as DomainEvent<unknown>))
      );
      await Promise.all(promises);
    }

    // Notify global subscribers
    const globalPromises = Array.from(this.globalSubscribers).map(handler =>
      Promise.resolve(handler(event as DomainEvent<unknown>))
    );
    await Promise.all(globalPromises);
  }

  /**
   * Publish multiple events
   */
  async publishBatch<TPayload>(events: DomainEvent<TPayload>[]): Promise<void> {
    const promises = events.map(event => this.publish(event));
    await Promise.all(promises);
  }

  /**
   * Subscribe to events of a specific type
   */
  subscribe<TPayload>(
    eventType: string,
    handler: EventHandler<DomainEvent<TPayload>, TPayload>
  ): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }

    const typeSubscribers = this.subscribers.get(eventType)!;
    typeSubscribers.add(handler as EventHandler<DomainEvent<unknown>, unknown>);

    // Return unsubscribe function
    return () => {
      this.unsubscribe(eventType, handler as EventHandler<DomainEvent<unknown>, unknown>);
    };
  }

  /**
   * Subscribe to all events
   */
  subscribeAll<TPayload>(handler: EventHandler<DomainEvent<TPayload>, TPayload>): () => void {
    this.globalSubscribers.add(handler as EventHandler<DomainEvent<unknown>, unknown>);

    // Return unsubscribe function
    return () => {
      this.globalSubscribers.delete(handler as EventHandler<DomainEvent<unknown>, unknown>);
    };
  }

  /**
   * Unsubscribe a handler from an event type
   */
  unsubscribe<TPayload>(eventType: string, handler: EventHandler<DomainEvent<TPayload>, TPayload>): void {
    const typeSubscribers = this.subscribers.get(eventType);
    if (typeSubscribers) {
      typeSubscribers.delete(handler as EventHandler<DomainEvent<unknown>, unknown>);
      if (typeSubscribers.size === 0) {
        this.subscribers.delete(eventType);
      }
    }
  }

  /**
   * Clear all subscriptions
   */
  clear(): void {
    this.subscribers.clear();
    this.globalSubscribers.clear();
  }

  /**
   * Get subscriber count for a specific event type (for testing)
   */
  getSubscriberCount(eventType: string): number {
    const typeSubscribers = this.subscribers.get(eventType);
    return typeSubscribers ? typeSubscribers.size : 0;
  }

  /**
   * Get total global subscriber count (for testing)
   */
  getGlobalSubscriberCount(): number {
    return this.globalSubscribers.size;
  }
}

