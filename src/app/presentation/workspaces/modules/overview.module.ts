/**
 * Overview Module - Workspace Dashboard
 * Layer: Presentation
 * Aggregates metrics from all modules
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { AcceptanceStore } from '@application/acceptance/stores/acceptance.store';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IssuesStore } from '@application/issues/stores/issues.store';
import { OverviewStore } from '@application/overview/stores/overview.store';
import { QualityControlStore } from '@application/quality-control/stores/quality-control.store';
import { TasksStore } from '@application/tasks/stores/tasks.store';
import { ModuleEventHelper } from '@presentation/workspaces/modules/basic/module-event-helper';

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
          <h3>{{ tasksStore.tasks().length }}</h3>
          <p>Total Tasks</p>
        </div>
        <div class="metric-card">
          <h3>{{ qcStore.pendingTasks().length }}</h3>
          <p>Pending QC</p>
        </div>
        <div class="metric-card">
          <h3>{{ acceptanceStore.pendingTasks().length }}</h3>
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
        <div class="metric-card" [class.health-good]="overviewStore.healthScore() >= 70" [class.health-warn]="overviewStore.healthScore() < 70">
          <h3>{{ overviewStore.healthScore() }}</h3>
          <p>Health Score</p>
        </div>
      </div>

      <div class="activity-section">
        <h3>Recent Activity</h3>
        @if (overviewStore.hasActivity()) {
          @for (activity of overviewStore.recentActivities().slice(-10); track activity.id) {
            <div class="activity-item">
              <span class="activity-type">{{ activity.type }}</span>
              <span class="activity-desc">{{ activity.description }}</span>
              <span class="activity-time">{{ activity.timestamp.toLocaleTimeString() }}</span>
            </div>
          }
        } @else {
          <div class="empty-state">No recent activity</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .overview-module { padding: 1.5rem; max-width: 1400px; }
    .module-header h2 { margin: 0 0 0.5rem 0; color: #1976d2; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .metric-card { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; text-align: center; }
    .metric-card h3 { margin: 0; font-size: 2rem; color: #1976d2; }
    .metric-card p { margin: 0.5rem 0 0 0; color: #666; }
    .metric-card.health-good h3 { color: #4caf50; }
    .metric-card.health-warn h3 { color: #f57c00; }
    .activity-section { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
    .activity-item { display: flex; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #f0f0f0; }
    .activity-type { font-weight: bold; color: #1976d2; min-width: 150px; }
    .activity-desc { flex: 1; }
    .activity-time { font-size: 0.75rem; color: #999; }
    .empty-state { text-align: center; color: #999; padding: 2rem; }
  `]
})
export class OverviewModule implements IAppModule, OnInit, OnDestroy {
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
    const eventTypes = ['TaskCreated', 'QCPassed', 'QCFailed', 'AcceptanceApproved', 'IssueCreated', 'IssueResolved'];
    
    eventTypes.forEach(eventType => {
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
        })
      );
    });
    
    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.overviewStore.clearOverview();
      })
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
