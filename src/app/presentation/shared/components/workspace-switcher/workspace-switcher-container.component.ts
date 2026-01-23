/**
 * Workspace Switcher Container Component
 *
 * Layer: Presentation - Shared Components
 * Purpose: Container for workspace switcher controls
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - Compose workspace trigger, menu, and create trigger
 * - Inject WorkspaceFacade for state and actions
 * - Handle user interactions and delegate to facade
 * - Single responsibility: workspace switcher orchestration
 * - NO domain/infrastructure imports
 * - NO manual subscribe/RxJS
 */

import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceFacade } from '@application/workspace/workspace.facade';
import { WorkspaceTriggerComponent } from './workspace-trigger.component';
import { WorkspaceMenuComponent } from './workspace-menu.component';
import { WorkspaceItem } from './types';
import { WorkspaceCreateTriggerComponent } from '@presentation/workspace/components/workspace-create-trigger.component';
import { WorkspaceCreateResult } from '@application/models/workspace-create-result.model';

@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  imports: [
    CommonModule,
    WorkspaceTriggerComponent,
    WorkspaceMenuComponent,
    WorkspaceCreateTriggerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (facade.hasWorkspace()) {
      <div class="workspace-switcher">
        <app-workspace-trigger
          [workspaceName]="workspaceName()"
          [isOpen]="isMenuOpen()"
          (triggerClick)="toggleMenu()"
        />

        @if (isMenuOpen()) {
          <app-workspace-menu
            [workspaces]="workspaceItems()"
            [activeWorkspaceId]="activeWorkspaceId()"
            (workspaceSelect)="onWorkspaceSelect($event)"
            (createWorkspace)="openCreateDialog()"
          />
        }
      </div>
    } @else {
      <div class="workspace-loading">
        <span class="material-icons">hourglass_empty</span>
        <span>Loading workspace...</span>
      </div>
    }

    <!-- Hidden create trigger component -->
    <app-workspace-create-trigger (dialogResult)="onWorkspaceCreated($event)" />
  `,
  styles: [`
    .workspace-switcher {
      position: relative;
    }

    .workspace-loading {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      color: var(--mat-sys-on-surface-variant, #49454f);
      font-size: 0.875rem;
    }

    .workspace-loading .material-icons {
      font-size: 1rem;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class WorkspaceSwitcherContainerComponent {
  readonly facade = inject(WorkspaceFacade);

  // Local UI state
  private readonly _isMenuOpen = signal(false);

  // Reference to create trigger component
  private readonly createTrigger = viewChild(WorkspaceCreateTriggerComponent);

  // Computed signals
  readonly isMenuOpen = computed(() => this._isMenuOpen());
  readonly workspaceName = computed(() => this.facade.currentWorkspaceName());
  readonly activeWorkspaceId = computed(() => this.facade.currentWorkspace()?.id ?? null);
  
  readonly workspaceItems = computed<WorkspaceItem[]>(() => {
    return this.facade.availableWorkspaces().map(w => ({
      id: w.id,
      name: w.name
    }));
  });

  /**
   * Toggle workspace menu
   */
  toggleMenu(): void {
    this._isMenuOpen.update(v => !v);
  }

  /**
   * Close menu
   */
  closeMenu(): void {
    this._isMenuOpen.set(false);
  }

  /**
   * Handle workspace selection
   * Delegates to facade
   */
  onWorkspaceSelect(workspaceId: string): void {
    this.closeMenu();
    this.facade.selectWorkspace(workspaceId);
  }

  /**
   * Open create workspace dialog
   */
  openCreateDialog(): void {
    this.closeMenu();
    const trigger = this.createTrigger();
    if (trigger) {
      trigger.openDialog();
    }
  }

  /**
   * Handle workspace creation result
   * Called via signal output binding
   */
  onWorkspaceCreated(result: WorkspaceCreateResult): void {
    this.facade.createWorkspace(result);
  }
}
