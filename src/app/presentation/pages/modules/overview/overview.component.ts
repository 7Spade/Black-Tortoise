/**
 * Overview Module - Workspace Dashboard
 * Layer: Presentation
 * 
 * Architecture: Pure reactive, event-driven aggregation
 * - Reads all metrics from OverviewStore (single source of truth)
 * - No direct module store injections (DDD compliance)
 * - Store handles event subscriptions via withHooks
 */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { OverviewStore } from '@application/stores/overview.store';

@Component({
  selector: 'app-overview-module',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overview-module">
      <div class="module-header">
        <h2>📈 Overview</h2>
        <p>Workspace Dashboard</p>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <h3>{{ overviewStore.metrics().totalTasks }}</h3>
          <p>Total Tasks</p>
        </div>
        <div class="metric-card">
          <h3>{{ overviewStore.metrics().pendingQC }}</h3>
          <p>Pending QC</p>
        </div>
        <div class="metric-card">
          <h3>{{ overviewStore.metrics().pendingAcceptance }}</h3>
          <p>Pending Acceptance</p>
        </div>
        <div class="metric-card">
          <h3>{{ overviewStore.metrics().openIssues }}</h3>
          <p>Open Issues</p>
        </div>
        <div class="metric-card">
          <h3>{{ overviewStore.taskCompletionRate() }}%</h3>
          <p>Completion Rate</p>
        </div>
        <div
          class="metric-card"
          [class.health-good]="overviewStore.healthScore() >= 70"
          [class.health-warn]="overviewStore.healthScore() < 70"
        >
          <h3>{{ overviewStore.healthScore() }}</h3>
          <p>Health Score</p>
        </div>
      </div>

      <div class="activity-section">
        <h3>Recent Activity</h3>
        @if (overviewStore.hasActivity()) {
          @for (
            activity of overviewStore.recentActivities().slice(-10);
            track activity.id
          ) {
            <div class="activity-item">
              <span class="activity-type">{{ activity.type }}</span>
              <span class="activity-desc">{{ activity.description }}</span>
              <span class="activity-time">{{
                activity.timestamp.toLocaleTimeString()
              }}</span>
            </div>
          }
        } @else {
          <div class="empty-state">No recent activity</div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements IAppModule {
  readonly id = 'overview';
  readonly name = 'Overview';
  readonly type: ModuleType = 'overview';

  readonly overviewStore = inject(OverviewStore);

  activate(): void {}
  deactivate(): void {}
  destroy(): void {}
}
