/**
 * Workspace Event Bus Interface
 * 
 * Layer: Domain
 * Purpose: Interface for workspace-scoped event bus (no RxJS in domain layer)
 * 
 * Semantic Rules:
 * - Event Bus is scoped per Workspace
 * - Modules only publish/subscribe, no direct calls
 * - No global singleton bus
 * 
 * Implementation with RxJS will be in Infrastructure layer
 */

import { DomainEvent } from '../event/domain-event';

/**
 * Event handler function type
 */
export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void;

/**
 * Event Bus Interface (Pure Domain)
 */
export interface WorkspaceEventBus {
  /**
   * Publish an event to the bus
   */
  publish(event: DomainEvent): void;
  
  /**
   * Subscribe to events of a specific type
   * Returns unsubscribe function
   */
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): () => void;
  
  /**
   * Get workspace ID this bus is scoped to
   */
  getWorkspaceId(): string;
  
  /**
   * Clear all subscriptions (cleanup)
   */
  clear(): void;
}
