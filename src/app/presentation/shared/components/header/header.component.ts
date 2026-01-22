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
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NotificationComponent } from '@presentation/shared/components/notification';
import { SearchComponent } from '@presentation/shared/components/search';
import { ThemeToggleComponent } from '@presentation/shared/components/theme-toggle';
import { UserAvatarComponent } from '@presentation/shared/components/user-avatar/user-avatar.component';
import { IdentitySwitcherComponent, WorkspaceCreateTriggerComponent, WorkspaceSwitcherComponent } from '@presentation/workspace';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    WorkspaceSwitcherComponent,
    IdentitySwitcherComponent,
    WorkspaceCreateTriggerComponent,
    SearchComponent,
    NotificationComponent,
    ThemeToggleComponent,
    UserAvatarComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // Inputs
  readonly showWorkspaceControls = input(true);
}