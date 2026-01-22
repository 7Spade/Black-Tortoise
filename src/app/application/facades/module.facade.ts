/**
 * Module Facade
 *
 * Layer: Application - Facade
 * Purpose: Coordinates module presentation concerns
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Provides reactive interface for module components
 * - Coordinates module event handling
 * - Manages module state coordination
 * - No business logic - pure presentation orchestration
 */

import { computed, Injectable, signal } from '@angular/core';
import { Module, ModuleType } from '@domain/module/module.interface';
import { WorkspaceEventBus } from '@domain/workspace/workspace-event-bus';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';

@Injectable({ providedIn: 'root' })
export class ModuleFacade {
  // Module state signals
  private readonly _activeModules = signal<Module[]>([]);
  private readonly _currentModule = signal<Module | null>(null);

  // Computed signals
  readonly activeModules = computed(() => this._activeModules());
  readonly currentModule = computed(() => this._currentModule());
  readonly hasActiveModules = computed(() => this._activeModules().length > 0);

  /**
   * Create a module event subscription helper
   * Returns an unsubscribe function
   */
  createModuleSubscription(
    eventBus: WorkspaceEventBus,
    eventType: string,
    handler: (event: any) => void
  ): () => void {
    return eventBus.subscribe(eventType, handler);
  }

  /**
   * Initialize module with event bus
   */
  initializeModule(
    module: Module,
    eventBus: WorkspaceEventBus
  ): void {
    // Publish module initialized event
    ModuleEventHelper.publishModuleInitialized(eventBus, module.id);

    // Add to active modules
    this._activeModules.update(modules => [...modules, module]);
  }

  /**
   * Activate a module
   */
  activateModule(module: Module): void {
    this._currentModule.set(module);
  }

  /**
   * Deactivate current module
   */
  deactivateCurrentModule(): void {
    this._currentModule.set(null);
  }

  /**
   * Get module interface and event bus types
   * This provides type-safe access without direct domain imports
   */
  getModuleTypes(): {
    Module: typeof Module;
    ModuleType: typeof ModuleType;
    WorkspaceEventBus: typeof WorkspaceEventBus;
  } {
    return {
      Module,
      ModuleType,
      WorkspaceEventBus
    };
  }

  /**
   * Create subscription manager for modules
   */
  createSubscriptionManager(): {
    add: (unsubscribeFn: () => void) => void;
    unsubscribeAll: () => void;
  } {
    return ModuleEventHelper.createSubscriptionManager();
  }
}