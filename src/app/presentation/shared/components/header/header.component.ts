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
import { IdentitySwitcherComponent, WorkspaceCreateTriggerComponent, WorkspaceSwitcherComponent } from '@presentation/workspace';
import { NotificationComponent } from '../notification';
import { SearchComponent } from '../search';
import { ThemeToggleComponent } from '../theme-toggle';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

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