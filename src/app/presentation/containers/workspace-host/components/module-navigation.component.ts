/**
 * Module Navigation Component
 *
 * Layer: Presentation
 * Purpose: Module navigation sidebar with collapsible functionality
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - Display module navigation list
 * - Handle sidebar collapse/expand
 * - Single responsibility: module navigation UI
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WorkspaceHostFacade } from '@application/facades/workspace-host.facade';

@Component({
  selector: 'app-module-navigation',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="module-nav" [class.collapsed]="facade.isSidebarCollapsed()">
      <div class="module-nav-header">
        <h3>Modules</h3>
        <button class="collapse-button" type="button" (click)="facade.toggleSidebar()">
          <span class="material-icons">
            @if (facade.isSidebarCollapsed()) { chevron_right } @else { chevron_left }
          </span>
        </button>
      </div>
      <ul class="module-list">
        @for (moduleId of facade.currentWorkspaceModules(); track moduleId) {
          @if (facade.getModuleMetadata(moduleId); as module) {
            <li class="module-item">
              <button
                class="module-button"
                [class.active]="facade.isModuleActive(moduleId)"
                (click)="facade.activateModule(moduleId)">
                <span class="material-icons">{{ module.icon }}</span>
                <span>{{ module.name }}</span>
              </button>
            </li>
          }
        }
      </ul>
    </nav>
  `,
  styles: [`
    .module-nav {
      width: 250px;
      background: #fafafa;
      border-right: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
    }

    .module-nav.collapsed {
      width: 60px;
    }

    .module-nav-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .module-nav.collapsed .module-nav-header {
      padding: 1rem;
      justify-content: center;
    }

    .module-nav.collapsed .module-nav-header h3 {
      display: none;
    }

    .module-nav-header h3 {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: #666;
    }

    .collapse-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .collapse-button:hover {
      background: #e0e0e0;
    }

    .module-list {
      list-style: none;
      margin: 0;
      padding: 0;
      flex: 1;
      overflow-y: auto;
    }

    .module-item {
      margin: 0.25rem 0;
    }

    .module-button {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      background: none;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      color: #333;
      text-align: left;
      transition: background-color 0.2s ease;
    }

    .module-nav.collapsed .module-button {
      padding: 0.75rem;
      justify-content: center;
    }

    .module-nav.collapsed .module-button span:not(.material-icons) {
      display: none;
    }

    .module-button:hover {
      background: #e0e0e0;
    }

    .module-button.active {
      background: var(--mat-sys-primary-container, #e8def8);
      color: var(--mat-sys-primary, #6750a4);
    }

    .module-button .material-icons {
      font-size: 1.25rem;
      min-width: 1.25rem;
    }
  `]
})
export class ModuleNavigationComponent {
  readonly facade = inject(WorkspaceHostFacade);
}