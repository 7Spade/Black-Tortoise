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
import { WorkspaceHostFacade } from '@application/facades';

@Component({
  selector: 'app-module-navigation',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="module-nav" [class.collapsed]="facade.isSidebarCollapsed()">
      <div class="module-nav-header">
        <h3>Modules</h3>
        <button
          class="collapse-button"
          type="button"
          (click)="facade.toggleSidebar()"
        >
          <span class="material-icons">
            @if (facade.isSidebarCollapsed()) {
              chevron_right
            } @else {
              chevron_left
            }
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
                (click)="facade.activateModule(moduleId)"
              >
                <span class="material-icons">{{ module.icon }}</span>
                <span>{{ module.name }}</span>
              </button>
            </li>
          }
        }
      </ul>
    </nav>
  `,
  styleUrls: ['./module-navigation.component.scss'],
})
export class ModuleNavigationComponent {
  readonly facade = inject(WorkspaceHostFacade);
}
