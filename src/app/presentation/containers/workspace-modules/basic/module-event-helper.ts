/**
 * Module Event Helper
 * 
 * Layer: Presentation/Shared
 * Purpose: Shared utilities for module event handling via event bus
 * 
 * Architecture:
 * - Modules should NOT inject stores or use-cases directly
 * - All communication via Application IModuleEventBus (subscribe ONLY)
 * - This helper provides common event subscription patterns
 * - Events flow through handle-domain-event.use-case (central bridge)
 * 
 * DDD Boundary Enforcement:
 * - Presentation MUST NOT publish events
 * - ALL event publishing via Application Use Cases
 * - Modules ONLY subscribe to react to events
 * 
 * Clean Architecture Compliance:
 * - Uses Application layer interfaces (IModuleEventBus)
 * - Uses Application layer events (not Domain events)
 * - No direct Domain dependencies
 * - READ-ONLY event bus access (subscribe only)
 */

import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  ModuleDataChanged,
} from '@application/events/module-events';

/**
 * Event handler type
 */
type EventHandler<T = any> = (event: T) => void;

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
    eventBus: IModuleEventBus,
    handler: EventHandler
  ): () => void {
    return eventBus.subscribe('WorkspaceSwitched', handler);
  }
  
  /**
   * Subscribe to ModuleActivated events
   * Modules can react when they or other modules are activated
   */
  static onModuleActivated(
    eventBus: IModuleEventBus,
    handler: EventHandler
  ): () => void {
    return eventBus.subscribe('ModuleActivated', handler);
  }
  
  /**
   * Subscribe to ModuleDeactivated events
   */
  static onModuleDeactivated(
    eventBus: IModuleEventBus,
    handler: EventHandler
  ): () => void {
    return eventBus.subscribe('ModuleDeactivated', handler);
  }
  
  /**
   * Subscribe to ModuleDataChanged events
   * Modules can listen for data changes from other modules
   */
  static onModuleDataChanged(
    eventBus: IModuleEventBus,
    handler: EventHandler<ModuleDataChanged>,
    filterByModule?: string
  ): () => void {
    if (filterByModule) {
      return eventBus.subscribe('ModuleDataChanged', (event: ModuleDataChanged) => {
        if (event.moduleId === filterByModule) {
          handler(event);
        }
      });
    }
    return eventBus.subscribe('ModuleDataChanged', handler);
  }
  
  /**
   * Create a managed subscription set
   * Helps modules manage multiple subscriptions easily
   */
  static createSubscriptionManager(): ModuleEventSubscriptions {
    return new ModuleEventSubscriptions();
  }
}
