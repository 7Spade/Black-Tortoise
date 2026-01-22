/**
 * Module Event Helper
 * 
 * Layer: Presentation/Shared
 * Purpose: Shared utilities for module event handling via WorkspaceEventBus
 * 
 * Architecture:
 * - Modules should NOT inject stores or use-cases directly
 * - All communication via WorkspaceEventBus (publish/subscribe)
 * - This helper provides common event subscription patterns
 * - Events flow through handle-domain-event.use-case (central bridge)
 */

import { ModuleDataChanged, ModuleError, ModuleInitialized } from '@domain/module/module-event';
import { EventHandler, WorkspaceEventBus } from '@domain/workspace/workspace-event-bus';

/**
 * Subscription manager for module lifecycle
 * Helps manage multiple event subscriptions and cleanup
 */
export class ModuleEventSubscriptions {
  private unsubscribeFunctions: Array<() => void> = [];
  
  /**
   * Add a subscription to be managed
   */
  add(unsubscribe: () => void): void {
    this.unsubscribeFunctions.push(unsubscribe);
  }
  
  /**
   * Unsubscribe from all managed subscriptions
   */
  unsubscribeAll(): void {
    this.unsubscribeFunctions.forEach(fn => fn());
    this.unsubscribeFunctions = [];
  }
}

/**
 * Common event subscription helpers
 */
export class ModuleEventHelper {
  
  /**
   * Subscribe to WorkspaceSwitched events
   * Common pattern: modules need to react when workspace changes
   */
  static onWorkspaceSwitched(
    eventBus: WorkspaceEventBus,
    handler: EventHandler
  ): () => void {
    return eventBus.subscribe('WorkspaceSwitched', handler);
  }
  
  /**
   * Subscribe to ModuleActivated events
   * Modules can react when they or other modules are activated
   */
  static onModuleActivated(
    eventBus: WorkspaceEventBus,
    handler: EventHandler
  ): () => void {
    return eventBus.subscribe('ModuleActivated', handler);
  }
  
  /**
   * Subscribe to ModuleDeactivated events
   */
  static onModuleDeactivated(
    eventBus: WorkspaceEventBus,
    handler: EventHandler
  ): () => void {
    return eventBus.subscribe('ModuleDeactivated', handler);
  }
  
  /**
   * Subscribe to ModuleDataChanged events
   * Modules can listen for data changes from other modules
   */
  static onModuleDataChanged(
    eventBus: WorkspaceEventBus,
    handler: EventHandler<ModuleDataChanged>,
    filterByModule?: string
  ): () => void {
    if (filterByModule) {
      return eventBus.subscribe('ModuleDataChanged', (event) => {
        const moduleEvent = event as ModuleDataChanged;
        if (moduleEvent.moduleId === filterByModule) {
          handler(moduleEvent);
        }
      });
    }
    return eventBus.subscribe('ModuleDataChanged', handler);
  }
  
  /**
   * Publish module initialized event
   */
  static publishModuleInitialized(
    eventBus: WorkspaceEventBus,
    moduleId: string
  ): void {
    const event: ModuleInitialized = {
      eventId: crypto.randomUUID(),
      eventType: 'ModuleInitialized',
      occurredAt: new Date(),
      moduleId,
      workspaceId: eventBus.getWorkspaceId(),
    };
    eventBus.publish(event);
  }
  
  /**
   * Publish module data changed event
   */
  static publishModuleDataChanged(
    eventBus: WorkspaceEventBus,
    moduleId: string,
    dataType: string,
    data: unknown
  ): void {
    const event: ModuleDataChanged = {
      eventId: crypto.randomUUID(),
      eventType: 'ModuleDataChanged',
      occurredAt: new Date(),
      moduleId,
      workspaceId: eventBus.getWorkspaceId(),
      dataType,
      data,
    };
    eventBus.publish(event);
  }
  
  /**
   * Publish module error event
   */
  static publishModuleError(
    eventBus: WorkspaceEventBus,
    moduleId: string,
    error: string
  ): void {
    const event: ModuleError = {
      eventId: crypto.randomUUID(),
      eventType: 'ModuleError',
      occurredAt: new Date(),
      moduleId,
      workspaceId: eventBus.getWorkspaceId(),
      error,
    };
    eventBus.publish(event);
  }
  
  /**
   * Create a managed subscription set
   * Helps modules manage multiple subscriptions easily
   */
  static createSubscriptionManager(): ModuleEventSubscriptions {
    return new ModuleEventSubscriptions();
  }
}
