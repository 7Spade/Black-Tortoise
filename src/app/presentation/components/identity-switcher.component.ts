/**
 * Identity Switcher Component
 *
 * Layer: Presentation
 * Purpose: Identity switcher controls for global header
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - UI controls only - emits user intent events for identity switching
 * - Consumes IdentityViewModel via IdentityFacade
 * - Pure Presentation - NO business logic
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IdentityFacade } from '@application/facades';
import { OrganizationCreateResult } from './organization-create-dialog.component';
import { OrganizationCreateTriggerComponent } from './organization-create-trigger.component';

@Component({
  selector: 'app-identity-switcher',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule, OrganizationCreateTriggerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./identity-switcher.component.scss'],
  template: `
    @if (facade.identityVm().isAuthenticated) {
      <div class="identity-switcher">
        <button
          mat-button
          class="identity-button"
          (click)="facade.toggleIdentityMenu()"
          aria-label="Switch identity">
          <mat-icon>{{ facade.identityVm().type === 'organization' ? 'business' : 'person' }}</mat-icon>
          <span class="identity-name">
            {{ facade.identityVm().displayName }}
          </span>
          @if (facade.identityVm().roleLabel) {
             <span class="role-badge">{{ facade.identityVm().roleLabel }}</span>
          }
          <mat-icon iconPositionEnd>expand_more</mat-icon>
        </button>
  
        @if (facade.showIdentityMenu()) {
          <div class="identity-menu-overlay" (click)="facade.closeIdentityMenu()"></div>
          <div class="identity-menu">
            <div class="identity-menu-item" (click)="facade.selectIdentity('personal')">
              <mat-icon>person</mat-icon>
              <span>Personal Account</span>
            </div>

            <div class="identity-menu-divider"></div>

            <div class="identity-menu-section-label">Organizations</div>

            @for (org of facade.organizations(); track org.id) {
              <div class="identity-menu-item" (click)="facade.selectOrganization(org.id, org.name)">
                <mat-icon>business</mat-icon>
                <span>{{ org.name }}</span>
              </div>
            } @empty {
              <div class="identity-menu-item disabled">
                 <span class="no-org-label">沒有任何組織</span>
              </div>
            }

            <div class="identity-menu-item" (click)="createTrigger.openDialog()">
               <mat-icon>add</mat-icon>
               <span>Create Organization</span>
            </div>
            <app-organization-create-trigger #createTrigger (dialogResult)="onOrganizationCreated($event)"></app-organization-create-trigger>

            <div class="identity-menu-divider"></div>
            <div class="identity-menu-item logout" (click)="facade.signOut()">
              <mat-icon>logout</mat-icon>
              <span>Sign Out</span>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .identity-switcher {
      position: relative;
    }

    .identity-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      max-width: 250px;
    }

    .identity-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
    }

    .role-badge {
        font-size: 0.75rem;
        background-color: var(--mat-sys-tertiary-container);
        color: var(--mat-sys-on-tertiary-container);
        padding: 0.1rem 0.4rem;
        border-radius: 4px;
        margin-left: 4px;
    }

    .identity-menu {
      position: absolute;
      top: 100%;
      right: 0;
      z-index: 1000;
      background: var(--mat-sys-surface-container-highest, #ffffff);
      border: 1px solid var(--mat-sys-outline-variant, #c4c7c5);
      border-radius: 0.5rem;
      box-shadow: var(--mat-sys-elevation-2, 0 2px 4px rgba(0, 0, 0, 0.1));
      min-width: 220px;
      margin-top: 0.25rem;
      padding: 0.5rem 0;
    }

    .identity-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999;
        cursor: default;
    }

    .identity-menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      cursor: pointer;
      color: var(--mat-sys-on-surface);
      transition: background-color 0.2s ease;
    }

    .identity-menu-item:hover {
      background-color: var(--mat-sys-surface-variant);
    }
    
    .identity-menu-item.disabled {
        cursor: default;
        opacity: 0.6;
        pointer-events: none;
        justify-content: center;
        font-size: 0.85rem;
    }
    
    .identity-menu-item.logout {
        color: var(--mat-sys-error);
    }

    .identity-menu-divider {
        height: 1px;
        background-color: var(--mat-sys-outline-variant);
        margin: 0.5rem 0;
    }

    .identity-menu-section-label {
        padding: 0.5rem 1rem 0.25rem 1rem;
        font-size: 0.75rem;
        color: var(--mat-sys-on-surface-variant);
        font-weight: 500;
        letter-spacing: 0.5px;
    }

    .create-wrapper {
        padding: 0.25rem 0.5rem; 
        /* Override default menu item padding to let the button handle it */
    }
  `]
})
export class IdentitySwitcherComponent {
  readonly facade = inject(IdentityFacade);

  onOrganizationCreated(result: OrganizationCreateResult | null) {
      if (result) {
          this.facade.createOrganization(result.organizationName);
      }
  }
}
