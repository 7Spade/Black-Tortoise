/**
 * Workspace Host Component
 *
 * Layer: Presentation
 * Purpose: Composes module navigation and content areas
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - Compose ModuleNavigationComponent and ModuleContentComponent
 * - Single responsibility: layout composition for workspace modules
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { WorkspaceHostFacade } from '@application/facades';
import {  ModuleContentComponent  } from '@presentation/components';;
import {  ModuleNavigationComponent  } from '@presentation/components';;

@Component({
  selector: 'app-workspace-host',
  standalone: true,
  imports: [CommonModule, ModuleNavigationComponent, ModuleContentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (facade.isLoading()) {
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading workspace...</p>
      </div>
    } @else if (facade.hasWorkspace()) {
      <div class="workspace-host" [class.collapsed]="facade.isSidebarCollapsed()">
        <app-module-navigation />
        <app-module-content />
      </div>
    } @else {
      <div class="no-workspace-container">
        <p>No workspace selected. Please select or create a workspace.</p>
      </div>
    }
  `,
  styles: [`
    .workspace-host {
      display: flex;
      height: 100%;
      background: white;
    }

    .workspace-host.collapsed {
      /* Collapsed state handled by child components */
    }
    
    .loading-container,
    .no-workspace-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 1rem;
    }
    
    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #1976d2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class WorkspaceHostComponent implements OnInit {
  readonly facade = inject(WorkspaceHostFacade);
  private readonly sidebarStorageKey = 'ui.sidebar';

  ngOnInit(): void {
    const stored = localStorage.getItem(this.sidebarStorageKey);
    this.facade.setSidebarCollapsed(stored === 'collapsed');

    // Auto-activate first module if none active (only if workspace is loaded)
    if (!this.facade.isLoading() && this.facade.hasWorkspace()) {
      const currentModules = this.facade.currentWorkspaceModules();
      const activeModule = this.facade.activeModuleId();

      const firstModule = currentModules[0];
      if (firstModule && !activeModule) {
        this.facade.activateModule(firstModule);
      }
    }
  }
}
