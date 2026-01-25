/**
 * Module Facade
 *
 * Layer: Application - Facade
 * Purpose: Provides module management services for Presentation layer
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Provides reactive interface for module components
 * - Coordinates module event handling via Application abstractions
 * - Manages module state coordination
 * - Provides event bus access without exposing Domain layer
 * - No business logic - pure presentation orchestration
 * 
 * Clean Architecture Compliance:
 * - Uses Application layer interfaces (IModuleEventBus, IAppModule)
 * - Wraps Domain event bus in Application adapter
 * - Presentation depends only on this facade
 */

import { computed, inject, Injectable, signal } from '@angular/core';
import { WorkspaceEventBusAdapter } from '../workspace/adapters/workspace-event-bus.adapter';
import { IAppModule } from '../interfaces/module.interface';
import { IModuleEventBus } from '../interfaces/module-event-bus.interface';
import { WORKSPACE_RUNTIME_FACTORY } from '../workspace/tokens/workspace-runtime.token';

@Injectable({ providedIn: 'root' })
export class ModuleFacade {
  private readonly runtimeFactory = inject(WORKSPACE_RUNTIME_FACTORY);
  
  // Module state signals
  private readonly _activeModules = signal<IAppModule[]>([]);
  private readonly _currentModule = signal<IAppModule | null>(null);

  // Computed signals
  readonly activeModules = computed(() => this._activeModules());
  readonly currentModule = computed(() => this._currentModule());
  readonly hasActiveModules = computed(() => this._activeModules().length > 0);

  /**
   * Get event bus for a workspace
   * 
   * Returns Application-layer IModuleEventBus interface
   */
  getEventBus(workspaceId: string): IModuleEventBus | null {
    const runtime = this.runtimeFactory.getRuntime(workspaceId);
    
    if (!runtime) {
      console.warn(`[ModuleFacade] Runtime not found for workspace: ${workspaceId}`);
      return null;
    }
    
    // Wrap domain event bus in application adapter
    return new WorkspaceEventBusAdapter(runtime.eventBus);
  }
  
  /**
   * Check if runtime exists for workspace
   */
  hasRuntime(workspaceId: string): boolean {
    return this.runtimeFactory.getRuntime(workspaceId) !== null;
  }

  /**
   * Initialize module with event bus
   */
  initializeModule(
    module: IAppModule,
    eventBus: IModuleEventBus
  ): void {
    // Initialize the module
    module.initialize(eventBus);

    // Add to active modules
    this._activeModules.update(modules => [...modules, module]);
  }

  /**
   * Activate a module
   */
  activateModule(module: IAppModule): void {
    module.activate();
    this._currentModule.set(module);
  }

  /**
   * Deactivate current module
   */
  deactivateCurrentModule(): void {
    const current = this._currentModule();
    if (current) {
      current.deactivate();
    }
    this._currentModule.set(null);
  }

  /**
   * Create subscription manager for modules
   */
  createSubscriptionManager(): {
    subscriptions: (() => void)[];
    add: (unsubscribeFn: () => void) => void;
    unsubscribeAll: () => void;
  } {
    const subscriptions: (() => void)[] = [];
    
    return {
      subscriptions,
      add: (unsubscribeFn: () => void) => {
        subscriptions.push(unsubscribeFn);
      },
      unsubscribeAll: () => {
        subscriptions.forEach(unsub => unsub());
        subscriptions.length = 0;
      }
    };
  }
}
