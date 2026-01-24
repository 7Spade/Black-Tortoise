/**
 * Calendar Page Component
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { CalendarStore } from '@application/calendar/stores/calendar.store';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="calendar-page">
      <h1>Calendar</h1>
      <mat-card>
        <mat-card-content>
          <p>Events: {{ store.events().length }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.calendar-page { padding: 24px; }`],
})
export class CalendarPageComponent {
  readonly store = inject(CalendarStore);
}
