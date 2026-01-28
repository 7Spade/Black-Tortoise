/**
 * Overview Module - Workspace Dashboard
 * Layer: Presentation
 * Aggregates metrics from all modules
 */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { AcceptanceStore } from '@acceptance/application/stores/acceptance.store';
import { IssuesStore } from '@issues/application/stores/issues.store';
import { OverviewStore } from '@overview/application/stores/overview.store';
import { QualityControlStore } from '@quality-control/application/stores/quality-control.store';
import { TasksStore } from '@tasks/application/stores/tasks.store';
import { ModuleEventHelper } from '@presentation/components/module-event-helper';

@Component({
  selector: 'app-overview-module',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overview-module">
      <div class="module-header">
        <h2>?? Overview</h2>
        <p>Workspace Dashboard</p>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <h3>{{ tasksStore.tasks().length }}</h3>
          <p>Total Tasks</p>
        </div>
        <div class="metric-card">
          <h3>{{ qcStore.pendingTasks().length }}</h3>
          <p>Pending QC</p>
        </div>
        <div class="metric-card">
          <h3>{{ acceptanceStore.pendingChecks().length }}</h3>
          <p>Pending Acceptance</p>
        </div>
        <div class="metric-card">
          <h3>{{ issuesStore.openIssues().length }}</h3>
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
export class OverviewComponent implements IAppModule, OnInit, OnDestroy {
  readonly id = 'overview';
  readonly name = 'Overview';
  readonly type: ModuleType = 'overview';

  @Input() eventBus: IModuleEventBus | undefined;

  readonly overviewStore = inject(OverviewStore);
  readonly tasksStore = inject(TasksStore);
  readonly qcStore = inject(QualityControlStore);
  readonly acceptanceStore = inject(AcceptanceStore);
  readonly issuesStore = inject(IssuesStore);

  private subscriptions = ModuleEventHelper.createSubscriptionManager();

  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }

  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;

    // Track all events for activity feed
    const eventTypes = [
      'TaskCreated',
      'QCPassed',
      'QCFailed',
      'AcceptanceApproved',
      'IssueCreated',
      'IssueResolved',
    ];

    eventTypes.forEach((eventType) => {
      this.subscriptions.add(
        eventBus.subscribe(eventType, (event: any) => {
          this.overviewStore.addActivity({
            type: eventType,
            description: `${eventType}: ${event.payload.taskTitle || event.payload.title || 'Action'}`,
            timestamp: new Date(event.timestamp),
            actorId: event.metadata?.userId || 'system',
          });

          // Update metrics
          if (eventType === 'TaskCreated') {
            this.overviewStore.incrementMetric('totalTasks');
          } else if (eventType === 'IssueCreated') {
            this.overviewStore.incrementMetric('openIssues');
          } else if (eventType === 'IssueResolved') {
            this.overviewStore.decrementMetric('openIssues');
          }
        }),
      );
    });

    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.overviewStore.clearOverview();
      }),
    );
  }

  activate(): void {}
  deactivate(): void {}
  destroy(): void {
    this.subscriptions.unsubscribeAll();
  }
  ngOnDestroy(): void {
    this.destroy();
  }
}
