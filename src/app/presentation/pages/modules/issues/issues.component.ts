/**
 * Issues Module - Defect & Issue Tracking
 * Layer: Presentation
 * Events: Reacts to QCFailed/AcceptanceRejected, Publishes IssueCreated/IssueResolved
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
import { FormsModule } from '@angular/forms';
import { CreateIssueHandler } from '@application/handlers/create-issue.handler';
import { ResolveIssueHandler } from '@application/handlers/resolve-issue.handler';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { IssuesStore } from '@issues/application/stores/issues.store';
import { ModuleEventHelper } from '@presentation/components/module-event-helper';

@Component({
  selector: 'app-issues-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="issues-module">
      <div class="module-header">
        <h2>?? Issues</h2>
        <p>Workspace: {{ eventBus?.workspaceId }}</p>
      </div>

      <div class="issues-section">
        <h3>Open Issues ({{ issuesStore.openIssues().length }})</h3>
        @if (issuesStore.openIssues().length === 0) {
          <div class="empty-state">No open issues</div>
        }
        @for (issue of issuesStore.openIssues(); track issue.id) {
          <div class="issue-card" [attr.data-priority]="issue.priority">
            <div class="issue-header">
              <h4>{{ issue.title }}</h4>
              <span class="priority">{{ issue.priority }}</span>
            </div>
            <p>{{ issue.description }}</p>
            <div class="issue-meta">
              <span>Created: {{ issue.createdAt.toLocaleString() }}</span>
              <span>Status: {{ issue.status }}</span>
            </div>
            <div class="issue-actions">
              <input
                type="text"
                [(ngModel)]="resolution"
                placeholder="Resolution notes..."
                class="input-field"
              />
              <button (click)="resolveIssue(issue.id)" class="btn-success">
                Resolve
              </button>
            </div>
          </div>
        }
      </div>

      <div class="resolved-section">
        <h3>Resolved ({{ issuesStore.resolvedIssues().length }})</h3>
        @for (issue of issuesStore.resolvedIssues(); track issue.id) {
          <div class="issue-card resolved">
            <h4>{{ issue.title }}</h4>
            <span>Resolved: {{ issue.resolvedAt?.toLocaleString() }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./issues.component.scss'],
})
export class IssuesComponent implements IAppModule, OnInit, OnDestroy {
  readonly id = 'issues';
  readonly name = 'Issues';
  readonly type: ModuleType = 'issues';

  @Input() eventBus: IModuleEventBus | undefined;
  readonly issuesStore = inject(IssuesStore);
  private readonly createIssueHandler = inject(CreateIssueHandler);
  private readonly resolveIssueHandler = inject(ResolveIssueHandler);

  resolution = '';
  private readonly currentUserId = 'user-demo-issues';
  private subscriptions = ModuleEventHelper.createSubscriptionManager();

  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }

  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;

    this.subscriptions.add(
      eventBus.subscribe('QCFailed', async (event: any) => {
        const issueId = crypto.randomUUID();
        await this.createIssueHandler.execute({
          issueId,
          taskId: event.aggregateId,
          workspaceId: eventBus.workspaceId,
          title: `QC Failed: ${event.payload.taskTitle}`,
          description: event.payload.failureReason,
          createdBy: this.currentUserId,
          correlationId: event.correlationId,
          causationId: event.eventId,
        });
      }),
    );

    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.issuesStore.reset();
      }),
    );
  }

  async resolveIssue(issueId: string): Promise<void> {
    if (!this.eventBus || !this.resolution.trim()) {
      alert('Please provide resolution notes');
      return;
    }

    const issue = this.issuesStore.issues().find((i) => i.id === issueId);
    if (!issue || !issue.taskId) return;

    await this.resolveIssueHandler.execute({
      issueId,
      taskId: issue.taskId,
      workspaceId: this.eventBus.workspaceId,
      resolvedBy: this.currentUserId,
      resolution: this.resolution,
    });

    this.resolution = '';
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
