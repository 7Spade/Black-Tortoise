/**
 * Overview Page Component
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { OverviewStore } from '@application/overview/stores/overview.store';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule],
  template: `
    <div class="overview-page">
      <h1>Workspace Overview</h1>
      <mat-grid-list cols="4" rowHeight="120px">
        <mat-grid-tile>
          <mat-card>
            <mat-card-content>
              <h2>{{ store.stats().totalTasks }}</h2>
              <p>Total Tasks</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        <mat-grid-tile>
          <mat-card>
            <mat-card-content>
              <h2>{{ store.stats().tasksInProgress }}</h2>
              <p>In Progress</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        <mat-grid-tile>
          <mat-card>
            <mat-card-content>
              <h2>{{ store.stats().openIssues }}</h2>
              <p>Open Issues</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        <mat-grid-tile>
          <mat-card>
            <mat-card-content>
              <h2>{{ store.stats().totalMembers }}</h2>
              <p>Members</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </div>
  `,
  styles: [`.overview-page { padding: 24px; }`],
})
export class OverviewPageComponent {
  readonly store = inject(OverviewStore);
}
