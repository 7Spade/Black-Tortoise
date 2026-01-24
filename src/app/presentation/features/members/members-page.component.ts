/**
 * Members Page Component
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { MembersStore } from '@application/members/stores/members.store';

@Component({
  selector: 'app-members-page',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="members-page">
      <h1>Members</h1>
      <mat-card>
        <mat-card-content>
          <p>Total Members: {{ store.totalMembers() }}</p>
          <p>Active: {{ store.activeMemberCount() }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.members-page { padding: 24px; }`],
})
export class MembersPageComponent {
  readonly store = inject(MembersStore);
}
