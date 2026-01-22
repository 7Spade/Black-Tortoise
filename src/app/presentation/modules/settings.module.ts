import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';

import { SettingsFooterComponent } from '../pages/settings/components/settings-footer.component';
import { SettingsFormComponent } from '../pages/settings/components/settings-form.component';
import { SettingsHeaderComponent } from '../pages/settings/components/settings-header.component';
import { SettingsPage } from '../pages/settings/settings.page';

@NgModule({
  declarations: [
    SettingsPage,
    SettingsHeaderComponent,
    SettingsFormComponent,
    SettingsFooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  exports: [
    SettingsPage
  ]
})
export class SettingsModule { }