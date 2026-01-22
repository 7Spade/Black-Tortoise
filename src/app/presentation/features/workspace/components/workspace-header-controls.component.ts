/**
 * Workspace Header Controls Component
 * 
 * Layer: Presentation
 * Purpose: Workspace and Identity switcher controls for global header
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 * 
 * Responsibilities:
 * - UI controls only - emits user intent events
 * - Must NOT open dialog or interpret dialog result
 * - Must only call facade for app actions (switch/create workspace)
 * - Uses WorkspaceCreateTriggerComponent for dialog opening
 */

import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal, viewChild } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { WorkspaceCreateTriggerComponent } from './workspace-create-trigger.component';
import { WorkspaceCreateResult } from '../models/workspace-create-result.model';

// Import facade from header feature (presentation-to-presentation is allowed for facades)
import { HeaderFacade } from '../../header/facade/header.facade';

@Component({
  selector: 'app-workspace-header-controls',
  standalone: true,
  imports: [CommonModule, WorkspaceCreateTriggerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./workspace-header-controls.component.scss'],
  template: `
    <!-- Workspace Switcher -->
    @if (workspaceContext.hasWorkspace()) {
      <div class="workspace-switcher">
        <button 
          class="workspace-button" 
          (click)="toggleWorkspaceMenu()"
          aria-label="Switch workspace"
          type="button">
          <span class="material-icons">folder</span>
          <span class="workspace-name">
            {{ workspaceContext.currentWorkspaceName() }}
          </span>
          <span class="material-icons">expand_more</span>
        </button>
        
        @if (showWorkspaceMenu()) {
          <div class="workspace-menu">
            @for (workspace of workspaceContext.availableWorkspaces(); track workspace.id) {
              <button 
                class="workspace-menu-item"
                [class.active]="workspace.id === workspaceContext.currentWorkspace()?.id"
                (click)="selectWorkspace(workspace.id)"
                type="button">
                <span class="material-icons">folder</span>
                <span>{{ workspace.name }}</span>
              </button>
            }
            <div class="workspace-menu-divider"></div>
            <button 
              class="workspace-menu-item" 
              (click)="createNewWorkspace()"
              type="button">
              <span class="material-icons">add</span>
              <span>Create Workspace</span>
            </button>
          </div>
        }
      </div>
    }

    <!-- Identity Switcher -->
    <div class="identity-switcher">
      <button 
        class="identity-button" 
        (click)="toggleIdentityMenu()"
        aria-label="Switch identity"
        type="button">
        <span class="material-icons">account_circle</span>
        <span class="identity-type org-name">
          {{ workspaceContext.currentOrganizationName() }}
        </span>
        <span class="identity-type">
          @if (workspaceContext.isAuthenticated()) {
            {{ workspaceContext.currentIdentityType() }}
          } @else {
            Guest
          }
        </span>
        <span class="material-icons">expand_more</span>
      </button>
      
      @if (showIdentityMenu()) {
        <div class="identity-menu">
          <div class="identity-menu-item">
            <span class="material-icons">person</span>
            <span>Personal Account</span>
          </div>
          <div class="identity-menu-item">
            <span class="material-icons">business</span>
            <span>Organization</span>
          </div>
          <div class="identity-menu-divider"></div>
          <div class="identity-menu-item">
            <span class="material-icons">logout</span>
            <span>Sign Out</span>
          </div>
        </div>
      }
    </div>

    <!-- WorkspaceCreateTriggerComponent - hidden, used programmatically -->
    <app-workspace-create-trigger />
  `,
})
export class WorkspaceHeaderControlsComponent {
  readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly facade = inject(HeaderFacade);

  readonly showWorkspaceMenu = signal(false);
  readonly showIdentityMenu = signal(false);

  // Reference to trigger component
  private readonly createTrigger = viewChild(WorkspaceCreateTriggerComponent);

  toggleWorkspaceMenu(): void {
    this.showWorkspaceMenu.update(v => !v);
    this.showIdentityMenu.set(false);
  }

  toggleIdentityMenu(): void {
    this.showIdentityMenu.update(v => !v);
    this.showWorkspaceMenu.set(false);
  }

  /**
   * Emit user intent: switch workspace
   * Delegates to facade for app action
   */
  selectWorkspace(workspaceId: string): void {
    this.showWorkspaceMenu.set(false);
    this.facade.switchWorkspace(workspaceId);
  }

  /**
   * Emit user intent: create new workspace
   * Uses WorkspaceCreateTriggerComponent to open dialog
   * Processes result via facade - NO business logic here
   */
  createNewWorkspace(): void {
    const trigger = this.createTrigger();
    if (!trigger) {
      return;
    }

    // Trigger opens dialog and returns Observable<unknown>
    trigger.openDialog().pipe(
      // Filter and type-narrow to WorkspaceCreateResult
      filter((result): result is WorkspaceCreateResult => 
        result !== null && 
        result !== undefined && 
        typeof result === 'object' &&
        'workspaceName' in result &&
        typeof (result as WorkspaceCreateResult).workspaceName === 'string' &&
        !!(result as WorkspaceCreateResult).workspaceName
      ),
      // Delegate to facade for app action
      tap((result) => {
        this.showWorkspaceMenu.set(false);
        this.facade.createWorkspace(result);
      })
    ).subscribe({
      error: () => {
        this.workspaceContext.setError('Failed to process dialog result');
      }
    });
  }
}
