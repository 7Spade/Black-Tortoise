/**
 * Workspace Host Facade
 *
 * Layer: Presentation - Facade
 * Purpose: Coordinates workspace host presentation concerns
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Manages workspace host UI state (sidebar collapsed, active module)
 * - Coordinates module navigation and activation
 * - Provides reactive signals for workspace host UI
 * - No business logic - pure presentation orchestration
 */

import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { ModuleMetadata, ModuleType, STANDARD_MODULES } from '@domain/module/module.interface';

@Injectable({ providedIn: 'root' })
export class WorkspaceHostFacade {
  private readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly router = inject(Router);

  // Local UI state
  private readonly _isSidebarCollapsed = signal(false);

  // Computed signals for workspace host UI
  readonly isSidebarCollapsed = computed(() => this._isSidebarCollapsed());
  readonly currentWorkspaceModules = computed(() =>
    this.workspaceContext.currentWorkspaceModules()
  );
  readonly activeModuleId = computed(() =>
    this.workspaceContext.activeModuleId()
  );

  /**
   * Toggle sidebar collapsed state
   */
  toggleSidebar(): void {
    this._isSidebarCollapsed.update(v => !v);
  }

  /**
   * Set sidebar collapsed state
   */
  setSidebarCollapsed(collapsed: boolean): void {
    this._isSidebarCollapsed.set(collapsed);
  }

  /**
   * Activate a module
   */
  activateModule(moduleId: string): void {
    this.workspaceContext.activateModule(moduleId);

    // Navigate to module route
    this.router.navigate(['/workspace', moduleId]).catch(() => {
      this.workspaceContext.setError(`Failed to navigate to module: ${moduleId}`);
    });
  }

  /**
   * Get module metadata for display
   */
  getModuleMetadata(moduleId: string): ModuleMetadata | null {
    const moduleData = STANDARD_MODULES[moduleId as ModuleType];
    if (!moduleData) return null;

    return {
      id: moduleId,
      ...moduleData,
    };
  }

  /**
   * Check if module is active
   */
  isModuleActive(moduleId: string): boolean {
    return this.activeModuleId() === moduleId;
  }
}