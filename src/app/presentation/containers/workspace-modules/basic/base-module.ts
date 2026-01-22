/**
 * Base Module Pattern
 * 
 * Layer: Presentation/Shared
 * Purpose: Common pattern for implementing Module interface with event bus
 * 
 * Usage:
 * - Modules can extend this or follow the pattern manually
 * - Event bus MUST be passed via @Input() or constructor
 * - No direct injection of stores or use-cases
 */

import { Input, OnDestroy } from '@angular/core';
import { Module } from '@domain/module/module.interface';
import { WorkspaceEventBus } from '@domain/workspace/workspace-event-bus';
import { ModuleEventHelper, ModuleEventSubscriptions } from './module-event-helper';

/**
 * Base implementation pattern for modules
 * 
 * Note: This is an abstract class that modules can extend.
 * Alternatively, modules can implement the pattern manually.
 */
export abstract class BaseModule implements Module, OnDestroy {
  /**
   * Event bus input - parent component must provide this
   * This is the ONLY way modules should receive dependencies
   */
  @Input() eventBus?: WorkspaceEventBus;
  
  /**
   * Subscription manager for cleanup
   */
  protected subscriptions: ModuleEventSubscriptions = 
    ModuleEventHelper.createSubscriptionManager();
  
  /**
   * Module metadata (implemented by subclass)
   */
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly type: any;
  
  /**
   * Initialize module with event bus
   * Called when event bus is available
   */
  initialize(eventBus: WorkspaceEventBus): void {
    this.eventBus = eventBus;
    this.setupEventSubscriptions(eventBus);
    ModuleEventHelper.publishModuleInitialized(eventBus, this.id);
  }
  
  /**
   * Setup event subscriptions - override in subclass
   */
  protected setupEventSubscriptions(eventBus: WorkspaceEventBus): void {
    // Default: subscribe to workspace switched
    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, (event) => {
        this.onWorkspaceSwitched(event);
      })
    );
  }
  
  /**
   * Handle workspace switched - override in subclass
   */
  protected onWorkspaceSwitched(event: any): void {
    console.log(`[${this.id}] Workspace switched:`, event);
  }
  
  /**
   * Activate module
   */
  activate(): void {
    console.log(`[${this.id}] Module activated`);
  }
  
  /**
   * Deactivate module
   */
  deactivate(): void {
    console.log(`[${this.id}] Module deactivated`);
  }
  
  /**
   * Cleanup on destroy
   */
  destroy(): void {
    this.subscriptions.unsubscribeAll();
    console.log(`[${this.id}] Module destroyed`);
  }
  
  /**
   * Angular lifecycle hook
   */
  ngOnDestroy(): void {
    this.destroy();
  }
}
