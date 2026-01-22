/**
 * Organization Switcher Container Component
 *
 * Layer: Presentation
 * Purpose: Organization switcher controls for global header
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - UI controls only - emits user intent events
 * - Must NOT open dialog or interpret dialog result
 * - Must only call facade for app actions (switch organization)
 * - Uses OrganizationCreateTriggerComponent for dialog opening
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { filter, tap } from 'rxjs/operators';
import { OrganizationCreateResult } from '../../features/organization/models/organization-create-result.model';
import { OrganizationCreateTriggerComponent } from './components/organization-create-trigger/organization-create-trigger.component';

// Import facade (to be created)
import { HeaderFacade } from '../../features/header/facade/header.facade';

@Component({
  selector: 'app-organization-switcher',
  standalone: true,
  imports: [CommonModule, OrganizationCreateTriggerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./organization-switcher.container.scss'],
  template: `
    <!-- Organization Switcher -->
    @if (workspaceContext.hasOrganization()) {
      <div class="organization-switcher">
        <button
          class="organization-button"
          (click)="toggleOrganizationMenu()"
          aria-label="Switch organization"
          type="button">
          <span class="material-icons">business</span>
          <span class="organization-name">
            {{ workspaceContext.currentOrganizationName() }}
          </span>
          <span class="material-icons">expand_more</span>
        </button>

        @if (showOrganizationMenu()) {
          <div class="organization-menu">
            @for (organization of workspaceContext.availableOrganizations(); track organization.id) {
              <button
                class="organization-menu-item"
                [class.active]="organization.id === workspaceContext.currentOrganization()?.id"
                (click)="selectOrganization(organization.id)"
                type="button">
                <span class="material-icons">business</span>
                <span>{{ organization.name }}</span>
              </button>
            }
            <div class="organization-menu-divider"></div>
            <button
              class="organization-menu-item"
              (click)="createNewOrganization()"
              type="button">
              <span class="material-icons">add</span>
              <span>Create Organization</span>
            </button>
          </div>
        }
      </div>
    }

    <!-- OrganizationCreateTriggerComponent - hidden, used programmatically -->
    <app-organization-create-trigger />
  `,
})
export class OrganizationSwitcherContainer {
  readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly facade = inject(HeaderFacade);

  readonly showOrganizationMenu = signal(false);

  // Reference to trigger component
  private readonly createTrigger = viewChild(OrganizationCreateTriggerComponent);

  toggleOrganizationMenu(): void {
    this.showOrganizationMenu.update(v => !v);
  }

  /**
   * Emit user intent: switch organization
   * Delegates to facade for app action
   */
  selectOrganization(organizationId: string): void {
    this.showOrganizationMenu.set(false);
    this.facade.switchOrganization(organizationId);
  }

  /**
   * Emit user intent: create new organization
   * Uses OrganizationCreateTriggerComponent to open dialog
   * Processes result via facade - NO business logic here
   */
  createNewOrganization(): void {
    const trigger = this.createTrigger();
    if (!trigger) {
      return;
    }

    // Trigger opens dialog and returns Observable<unknown>
    trigger.openDialog().pipe(
      // Filter and type-narrow to OrganizationCreateResult
      filter((result): result is OrganizationCreateResult =>
        result !== null &&
        result !== undefined &&
        typeof result === 'object' &&
        'organizationName' in result &&
        typeof (result as OrganizationCreateResult).organizationName === 'string' &&
        !!(result as OrganizationCreateResult).organizationName
      ),
      // Delegate to facade for app action
      tap((result) => {
        this.showOrganizationMenu.set(false);
        this.facade.createOrganization(result);
      })
    ).subscribe({
      error: () => {
        this.workspaceContext.setError('Failed to process dialog result');
      }
    });
  }
}