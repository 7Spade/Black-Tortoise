/**
 * Module Content Component
 *
 * Layer: Presentation
 * Purpose: Module content display area with router outlet
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - Display active module content
 * - Manage router outlet for module routing
 * - Single responsibility: module content presentation
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkspaceHostFacade } from '@application/facades';

@Component({
  selector: 'app-module-content',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="module-content">
      @if (facade.activeModuleId(); as moduleId) {
        @if (facade.getModuleMetadata(moduleId); as module) {
          <div class="module-header">
            <h2>
              <span class="material-icons">{{ module.icon }}</span>
              {{ module.name }}
            </h2>
            <p>{{ module.description }}</p>
          </div>

          <!-- Dynamic module content will be loaded here -->
          <div class="module-body">
            <router-outlet />
          </div>
        }
      } @else {
        <div class="no-module">
          <span class="material-icons">apps</span>
          <p>Select a module to get started</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./module-content.component.scss'],
})
export class ModuleContentComponent {
  readonly facade = inject(WorkspaceHostFacade);
}
