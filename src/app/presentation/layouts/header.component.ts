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
import { WorkspaceSwitcherComponent } from '@presentation/components';
import {  IdentitySwitcherComponent  } from '@presentation/components';;
import {  NotificationComponent  } from '@presentation/components';;
import {  SearchComponent  } from '@presentation/components';;
import {  ThemeToggleComponent  } from '@presentation/components';;
import {  UserAvatarComponent  } from '@presentation/components';;

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
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // Inputs
  readonly showWorkspaceControls = input(true);
}
