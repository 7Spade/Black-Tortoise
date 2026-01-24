/**
 * Workspace Event Bus Adapter
 * 
 * Layer: Application
 * Purpose: Adapts Domain WorkspaceEventBus to Application IModuleEventBus interface
 * Architecture: Pure signal-based, no manual subscriptions
 * 
 * This adapter wraps the Domain event bus and exposes it through the
 * Application layer interface. This allows Presentation components to
 * use event bus without depending on Domain types.
 * 
 * Pattern: Adapter Pattern
 * Constitution Compliance: No RxJS, No manual subscribe patterns
 */

import { WorkspaceEventBus } from '@domain/workspace';
import { EventHandler, IModuleEventBus } from '../../interfaces/module-event-bus.interface';

/**
 * Event Bus Adapter
 * 
 * Wraps Domain WorkspaceEventBus for Application layer consumption.
 * Simply delegates to domain interface - no subscription logic here.
 */
export class WorkspaceEventBusAdapter implements IModuleEventBus {
  constructor(private readonly domainEventBus: WorkspaceEventBus) {}
  
  get workspaceId(): string {
    return this.domainEventBus.getWorkspaceId();
  }
  
  publish<T>(event: T): void {
    this.domainEventBus.publish(event as any);
  }
  
  /**
   * Subscribe delegates to domain event bus
   * Returns cleanup function as per interface contract
   */
  subscribe<T>(
    eventType: string,
    handler: EventHandler<T>
  ): () => void {
    return this.domainEventBus.subscribe(eventType, handler as any);
  }
  
  clear(): void {
    this.domainEventBus.clear();
  }
}
