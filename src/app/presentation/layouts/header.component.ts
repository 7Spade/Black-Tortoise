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
import { IdentitySwitcherComponent, NotificationComponent, SearchComponent, ThemeToggleComponent, UserAvatarComponent, WorkspaceSwitcherComponent } from '@presentation/components';
;
;
;
;
;

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
    UserAvatarComponent
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
  styles: [`
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 4rem;
  background: var(--mat-sys-surface-container-lowest, #ffffff);
  border-bottom: 1px solid var(--mat-sys-outline-variant, #c4c7c5);
  position: relative;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 0 1 auto;
  min-width: 0;
  max-width: 50%;
}

.workspace-controls {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--mat-sys-primary, #6750a4);
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.125rem;
}

.header-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 1 auto;
  max-width: 500px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    padding: 0 1rem;
  }

  .logo-text {
    display: none;
  }

  .header-left {
    gap: 1rem;
  }

  .header-right {
    gap: 0.25rem;
  }
}

@media (max-width: 480px) {
  .header-center {
    display: none;
  }
}
  `]
})
export class HeaderComponent {
  // Inputs
  readonly showWorkspaceControls = input(true);
}
