import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IdentityFacade } from '@application/facades';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  template: `
    <div class="user-avatar-container">
      <button
        class="avatar-button"
        (click)="facade.toggleAvatarMenu()"
        type="button"
      >
        @if (facade.userAvatarVm().photoUrl; as url) {
          <img [src]="url" alt="User avatar" class="avatar-img" />
        } @else {
          <div
            class="avatar-placeholder"
            [style.background-color]="facade.userAvatarVm().color"
            aria-hidden="true"
          >
            <span class="initials">{{ facade.userAvatarVm().initials }}</span>
          </div>
        }
      </button>

      @if (facade.showAvatarMenu()) {
        <div
          class="avatar-menu-overlay"
          (click)="facade.closeAvatarMenu()"
        ></div>
        <div class="avatar-menu">
          <div class="menu-header">
            <span
              class="initials-small"
              [style.background-color]="facade.userAvatarVm().color"
            >
              {{ facade.userAvatarVm().initials }}
            </span>
            <span class="display-name">{{
              facade.identityVm().displayName
            }}</span>
          </div>

          <div class="menu-divider"></div>

          <button class="menu-item" (click)="facade.navigateToProfile()">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>

          <button class="menu-item" (click)="facade.navigateToSettings()">
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>

          <div class="menu-divider"></div>

          <button class="menu-item logout" (click)="facade.signOut()">
            <mat-icon>logout</mat-icon>
            <span>Sign Out</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      /**
 * User Avatar Component Styles
 * Using Material 3 Design Tokens
 */

      :host {
        display: inline-block;
        position: relative;
      }

      .user-avatar-container {
        position: relative;
      }

      .avatar-button {
        width: 40px;
        height: 40px;
        padding: 0;
        border: none;
        background: none;
        cursor: pointer;
        border-radius: 50%;
        overflow: hidden;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.8;
        }
      }

      .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .avatar-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 500;
        font-size: 1rem;
        text-transform: uppercase;
      }

      // Menu Styles

      .avatar-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 998;
        cursor: default;
      }

      .avatar-menu {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 999;
        background: var(--mat-sys-surface-container-highest, #ffffff);
        border: 1px solid var(--mat-sys-outline-variant, #c4c7c5);
        border-radius: 0.75rem;
        box-shadow: var(--mat-sys-elevation-2, 0 2px 4px rgba(0, 0, 0, 0.1));
        min-width: 240px;
        margin-top: 0.5rem;
        padding: 0.5rem 0;
        overflow: hidden;
      }

      .menu-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background-color: var(--mat-sys-surface-container);
      }

      .initials-small {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .display-name {
        font-weight: 500;
        color: var(--mat-sys-on-surface);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .menu-item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--mat-sys-on-surface);
        font-size: 0.875rem;
        text-align: left;
        transition: background-color 0.2s;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          color: var(--mat-sys-on-surface-variant);
        }

        &:hover {
          background-color: var(--mat-sys-surface-variant);
        }

        &.logout {
          color: var(--mat-sys-error);
          mat-icon {
            color: var(--mat-sys-error);
          }
        }
      }

      .menu-divider {
        height: 1px;
        background-color: var(--mat-sys-outline-variant);
        margin: 0.25rem 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent {
  readonly facade = inject(IdentityFacade);
}
