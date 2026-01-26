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
 * 
 * Clean Architecture Compliance:
 * - Uses Application layer interfaces (IAppModule, IModuleEventBus)
 * - No direct Domain dependencies
 * - Receives event bus via dependency injection pattern
 */

import { Directive, Input, OnDestroy } from '@angular/core';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { IAppModule } from '@application/interfaces/module.interface';
import { ModuleEventHelper, ModuleEventSubscriptions } from '@presentation/workspaces/modules/basic/module-event-helper';

/**
 * Base implementation pattern for modules
 * 
 * Note: This is an abstract directive that modules can extend.
 * Alternatively, modules can implement the pattern manually.
 */
@Directive()
export abstract class BaseModule implements IAppModule, OnDestroy {
  /**
   * Event bus input - parent component must provide this
   * This is the ONLY way modules should receive dependencies
   */
  @Input() eventBus: IModuleEventBus | undefined;
  
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
  abstract readonly type: string;
  
  /**
   * Initialize module with event bus
   * Called when event bus is available
   */
  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;
    this.setupEventSubscriptions(eventBus);
    console.log(`[${this.id}] Module initialized for workspace: ${eventBus.workspaceId}`);
  }
  
  /**
   * Setup event subscriptions - override in subclass
   */
  protected setupEventSubscriptions(eventBus: IModuleEventBus): void {
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
