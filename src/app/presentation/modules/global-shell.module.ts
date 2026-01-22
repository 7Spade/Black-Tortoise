import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { ContextSwitcherContainer } from '../containers/context-switcher/context-switcher.container';
import { OrganizationSwitcherContainer } from '../containers/organization-switcher/organization-switcher.container';
import { TeamSwitcherContainer } from '../containers/team-switcher/team-switcher.container';
import { WorkspaceSwitcherContainer } from '../containers/workspace-switcher/workspace-switcher.container';
import { UserAvatarComponent } from '../shared/components/user-avatar/user-avatar.component';
import { GlobalShellComponent } from '../shell/global-shell.component';

@NgModule({
  declarations: [
    GlobalShellComponent,
    WorkspaceSwitcherContainer,
    OrganizationSwitcherContainer,
    TeamSwitcherContainer,
    ContextSwitcherContainer,
    UserAvatarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  exports: [
    GlobalShellComponent
  ]
})
export class GlobalShellModule { }