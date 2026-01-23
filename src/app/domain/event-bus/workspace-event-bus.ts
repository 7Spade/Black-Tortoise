/**
 * WorkspaceEventBus
 * 
 * Layer: Domain
 * DDD Pattern: Event Bus Implementation
 * 
 * Workspace-scoped implementation of the EventBus interface.
 * Manages event publishing and subscription within a workspace context.
 * Uses in-memory pub/sub for real-time event handling.
 */

import { EventBus, EventHandler } from './event-bus.interface';
import { DomainEvent } from '../event-store/event-store.interface';

export class WorkspaceEventBus implements EventBus {
  private subscribers: Map<string, Set<EventHandler>> = new Map();
  private globalSubscribers: Set<EventHandler> = new Set();

  /**
   * Publish a domain event to all subscribers
   */
  async publish(event: DomainEvent): Promise<void> {
    // Notify type-specific subscribers
    const typeSubscribers = this.subscribers.get(event.eventType);
    if (typeSubscribers) {
      const promises = Array.from(typeSubscribers).map(handler =>
        Promise.resolve(handler(event))
      );
      await Promise.all(promises);
    }

    // Notify global subscribers
    const globalPromises = Array.from(this.globalSubscribers).map(handler =>
      Promise.resolve(handler(event))
    );
    await Promise.all(globalPromises);
  }

  /**
   * Publish multiple events
   */
  async publishBatch(events: DomainEvent[]): Promise<void> {
    const promises = events.map(event => this.publish(event));
    await Promise.all(promises);
  }

  /**
   * Subscribe to events of a specific type
   */
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }

    const typeSubscribers = this.subscribers.get(eventType)!;
    typeSubscribers.add(handler as EventHandler);

    // Return unsubscribe function
    return () => {
      this.unsubscribe(eventType, handler as EventHandler);
    };
  }

  /**
   * Subscribe to all events
   */
  subscribeAll(handler: EventHandler): () => void {
    this.globalSubscribers.add(handler);

    // Return unsubscribe function
    return () => {
      this.globalSubscribers.delete(handler);
    };
  }

  /**
   * Unsubscribe a handler from an event type
   */
  unsubscribe(eventType: string, handler: EventHandler): void {
    const typeSubscribers = this.subscribers.get(eventType);
    if (typeSubscribers) {
      typeSubscribers.delete(handler);
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
