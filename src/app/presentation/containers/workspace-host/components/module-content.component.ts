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
import { WorkspaceHostFacade } from '@application/facades/workspace-host.facade';

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
  styles: [`
    .module-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: white;
      overflow: hidden;
    }

    .module-header {
      padding: 2rem;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
    }

    .module-header h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .module-header h2 .material-icons {
      color: var(--mat-sys-primary, #6750a4);
      font-size: 1.75rem;
    }

    .module-header p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }

    .module-body {
      flex: 1;
      overflow: auto;
      padding: 0;
    }

    .no-module {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #666;
      text-align: center;
      padding: 3rem;
    }

    .no-module .material-icons {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .no-module p {
      margin: 0;
      font-size: 1.125rem;
    }
  `]
})
export class ModuleContentComponent {
  readonly facade = inject(WorkspaceHostFacade);
}