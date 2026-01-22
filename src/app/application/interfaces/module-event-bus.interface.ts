/**
 * Module Event Bus Interface (Application Layer)
 * 
 * Layer: Application
 * Purpose: Application-layer abstraction for event bus communication
 * 
 * This interface provides a clean contract for Presentation layer modules
 * to communicate via events without directly depending on Domain layer types.
 * 
 * The concrete implementation wraps the Domain WorkspaceEventBus.
 */

/**
 * Generic Event Handler
 */
export type EventHandler<T = any> = (event: T) => void;

/**
 * Application Module Event Bus
 * 
 * Presentation modules use this interface for event-driven communication
 */
export interface IModuleEventBus {
  /**
   * Workspace ID this event bus is scoped to
   */
  readonly workspaceId: string;
  
  /**
   * Publish an event
   */
  publish<T>(event: T): void;
  
  /**
   * Subscribe to events of a specific type
   * Returns unsubscribe function
   */
  subscribe<T>(
    eventType: string,
    handler: EventHandler<T>
  ): () => void;
  
  /**
   * Clear all subscriptions
   */
  clear(): void;
}
