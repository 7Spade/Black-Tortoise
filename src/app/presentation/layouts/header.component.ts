/**
 * Header Component
 *
 * Layer: Presentation
 * Purpose: Global header layout - composes workspace and identity switchers
 * Architecture: Zone-less, OnPush, Angular 20 control flow, M3 tokens
 *
 * Responsibilities:
 * - Layout only - combines workspace and identity switchers
 * - Composes child components for workspace controls, identity controls, search, notifications, theme, user avatar
 * - Manages header layout and positioning
 * - Single responsibility: header layout composition
 * - NO facade injection - pure layout composition
 * - NO business logic - delegates all actions to child components
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IdentitySwitcherComponent, UserAvatarComponent } from '@account/index';
import {
  NotificationComponent,
  SearchComponent,
  ThemeToggleComponent,
} from '@presentation/components';
import { WorkspaceSwitcherComponent } from '@workspace/presentation';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    WorkspaceSwitcherComponent,
    IdentitySwitcherComponent,
    SearchComponent,
    NotificationComponent,
    ThemeToggleComponent,
    UserAvatarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="header">
      <!-- Left Section: Logo + Workspace Controls -->
      <div class="header-left">
        <div class="logo">
          <span class="material-icons logo-icon">code</span>
          <span class="logo-text">Black Tortoise</span>
        </div>

        @if (showWorkspaceControls()) {
          <div class="workspace-controls">
            <app-workspace-switcher />
          </div>
        }
      </div>

      <!-- Center Section: Search -->
      <div class="header-center">
        <app-search />
      </div>

      <!-- Right Section: Notifications + Theme + Identity + User Avatar -->
      <div class="header-right">
        <app-notification />
        <app-theme-toggle />
        <app-identity-switcher />
        <app-user-avatar />
      </div>
    </div>
  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  // Inputs
  readonly showWorkspaceControls = input(true);
}
