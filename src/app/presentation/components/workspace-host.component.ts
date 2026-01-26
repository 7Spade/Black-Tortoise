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
    <div class="workspace-host" [class.collapsed]="facade.isSidebarCollapsed()">
      <app-module-navigation />
      <app-module-content />
    </div>
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
  `]
})
export class WorkspaceHostComponent implements OnInit {
  readonly facade = inject(WorkspaceHostFacade);
  private readonly sidebarStorageKey = 'ui.sidebar';

  ngOnInit(): void {
    const stored = localStorage.getItem(this.sidebarStorageKey);
    this.facade.setSidebarCollapsed(stored === 'collapsed');

    // Auto-activate first module if none active
    const currentModules = this.facade.currentWorkspaceModules();
    const activeModule = this.facade.activeModuleId();

    const firstModule = currentModules[0];
    if (firstModule && !activeModule) {
      this.facade.activateModule(firstModule);
    }
  }
}
