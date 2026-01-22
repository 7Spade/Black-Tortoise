/**
 * Identity Switcher Component
 *
 * Layer: Presentation
 * Purpose: Identity switcher controls for global header
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - UI controls only - emits user intent events for identity switching
 * - Must NOT open dialog or interpret dialog result
 * - Must only call facade for app actions (switch identity)
 * - Single responsibility: identity management UI
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IdentityPresentationFacade } from '../facade/identity-presentation.facade';

@Component({
  selector: 'app-identity-switcher',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Identity Switcher -->
    <div class="identity-switcher">
      <button
        class="identity-button"
        (click)="facade.toggleIdentityMenu()"
        aria-label="Switch identity"
        type="button">
        <span class="material-icons">account_circle</span>
        <span class="identity-type org-name">
          {{ facade.currentOrganizationName() }}
        </span>
        <span class="identity-type">
          @if (facade.isAuthenticated()) {
            {{ facade.currentIdentityType() }}
          } @else {
            Guest
          }
        </span>
        <span class="material-icons">expand_more</span>
      </button>

      @if (facade.showIdentityMenu()) {
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
  `,
  styles: [`
    .identity-switcher {
      position: relative;
    }

    .identity-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: none;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      color: var(--mat-sys-on-surface, #1c1b1f);
      font-size: 0.875rem;
      transition: background-color 0.2s ease;
    }

    .identity-button:hover {
      background: var(--mat-sys-surface-container-highest, #e6e0e9);
    }

    .identity-type {
      font-weight: 500;
    }

    .org-name {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
      min-width: 200px;
      margin-top: 0.25rem;
    }

    .identity-menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      cursor: pointer;
      color: var(--mat-sys-on-surface, #1c1b1f);
      transition: background-color 0.2s ease;
    }

    .identity-menu-item:hover {
      background: var(--mat-sys-surface-container-highest, #f7f2fa);
    }

    .identity-menu-divider {
      height: 1px;
      background: var(--mat-sys-outline-variant, #c4c7c5);
      margin: 0.25rem 0;
    }
  `]
})
export class IdentitySwitcherComponent {
  readonly facade = inject(IdentityPresentationFacade);
}