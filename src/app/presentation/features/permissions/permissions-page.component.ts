/**
 * Permissions Page Component
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { PermissionsStore } from '@application/permissions/stores/permissions.store';

@Component({
  selector: 'app-permissions-page',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="permissions-page">
      <h1>Permissions</h1>
      <mat-card>
        <mat-card-content>
          <p>Roles: {{ store.roles().length }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.permissions-page { padding: 24px; }`],
})
export class PermissionsPageComponent {
  readonly store = inject(PermissionsStore);
}
