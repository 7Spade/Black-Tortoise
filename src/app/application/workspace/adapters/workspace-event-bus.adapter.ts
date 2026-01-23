/**
 * Workspace Event Bus Adapter
 * 
 * Layer: Application
 * Purpose: Adapts Domain WorkspaceEventBus to Application IModuleEventBus interface
 * 
 * This adapter wraps the Domain event bus and exposes it through the
 * Application layer interface. This allows Presentation components to
 * use event bus without depending on Domain types.
 * 
 * Pattern: Adapter Pattern
 */

import { WorkspaceEventBus } from '@domain/workspace';
import { 
  EventHandler, 
  IModuleEventBus 
} from '../interfaces/module-event-bus.interface';

/**
 * Event Bus Adapter
 * 
 * Wraps Domain WorkspaceEventBus for Application layer consumption
 */
export class WorkspaceEventBusAdapter implements IModuleEventBus {
  constructor(private readonly domainEventBus: WorkspaceEventBus) {}
  
  get workspaceId(): string {
    return this.domainEventBus.getWorkspaceId();
  }
  
  publish<T>(event: T): void {
    this.domainEventBus.publish(event as any);
  }
  
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
