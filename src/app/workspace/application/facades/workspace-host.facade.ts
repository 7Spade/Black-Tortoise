import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceStore } from '../stores/workspace.store';
import { ModuleMetadata, ModuleType, STANDARD_MODULES } from '@domain/types';

@Injectable({ providedIn: 'root' })
export class WorkspaceHostFacade {
  private readonly workspaceStore = inject(WorkspaceStore);
  private readonly router = inject(Router);

  // Local UI state
  private readonly _isSidebarCollapsed = signal(false);

  // Computed signals for workspace host UI
  readonly isSidebarCollapsed = computed(() => this._isSidebarCollapsed());
  readonly currentWorkspaceModules = computed(() =>
    this.workspaceStore.currentWorkspaceModules()
  );
  readonly activeModuleId = computed(() =>
    this.workspaceStore.activeModuleId()
  );
  readonly isLoading = computed(() => this.workspaceStore.isLoading());
  readonly hasWorkspace = computed(() => this.workspaceStore.hasWorkspace());

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
    this.workspaceStore.activateModule(moduleId);

    // Navigate to module route
    this.router.navigate(['/workspace', moduleId]).catch(() => {
      this.workspaceStore.setError(`Failed to navigate to module: ${moduleId}`);
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
