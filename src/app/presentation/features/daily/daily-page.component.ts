/**
 * Daily Page Component
 *
 * Layer: Presentation
 * Purpose: Daily work log interface
 * Architecture: Zone-less, Signal-based
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DailyStore } from '@application/daily/stores/daily.store';

@Component({
  selector: 'app-daily-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="daily-page">
      <header class="page-header">
        <h1>Daily Work Log</h1>
        <p>Total Hours Today: {{ store.totalHoursToday() }}</p>
      </header>
      <mat-card>
        <mat-card-content>
          <p class="empty-state">Daily work log interface</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .daily-page { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .empty-state { text-align: center; padding: 48px; }
  `],
})
export class DailyPageComponent {
  readonly store = inject(DailyStore);
}
