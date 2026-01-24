/**
 * Audit Page Component
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

import { AuditStore } from '@application/audit/stores/audit.store';

@Component({
  selector: 'app-audit-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  template: `
    <div class="audit-page">
      <h1>Audit Trail</h1>
      <mat-card>
        <mat-card-content>
          <p>Total Events: {{ store.totalEntries() }}</p>
          <mat-list>
            @for (entry of store.recentEntries(); track entry.eventId) {
              <mat-list-item>
                <span matListItemTitle>{{ entry.action }}</span>
                <span matListItemLine>{{ entry.timestamp | date:'short' }}</span>
              </mat-list-item>
            }
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.audit-page { padding: 24px; }`],
})
export class AuditPageComponent {
  readonly store = inject(AuditStore);
}
