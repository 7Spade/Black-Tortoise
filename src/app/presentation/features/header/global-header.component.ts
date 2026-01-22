/**
 * Global Header Component
 * 
 * Layer: Presentation
 * Purpose: Global header layout - composes child components
 * Architecture: Zone-less, OnPush, Angular 20 control flow, M3 tokens
 * 
 * Header Layout (Updated):
 * - Left: Logo (icon + text on single line)
 * - Center: Workspace Controls (left of search) + Search + Notifications + Theme Toggle
 * - Right: User Avatar with menu (settings/profile links)
 * 
 * Responsibilities:
 * - Layout only - no MatDialog, no afterClosed, no use case calls
 * - Composes child components for workspace controls, search, notifications, theme, user avatar
 * - Manages local UI state (notifications visibility) via signals
 * - Delegates theme management to ThemeToggleComponent
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { SearchComponent } from '../../shared/components/search/search.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import {
  WorkspaceCreateTriggerComponent,
  WorkspaceSwitcherComponent
} from '../workspace';
import { HeaderPresentationFacade } from './facade/header-presentation.facade';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [
    CommonModule, 
    WorkspaceSwitcherComponent,
    WorkspaceCreateTriggerComponent,
    SearchComponent, 
    NotificationComponent,
    ThemeToggleComponent,
    UserAvatarComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent {
  readonly facade = inject(HeaderPresentationFacade);

  // Inputs
  readonly showWorkspaceControls = input(true);
}
