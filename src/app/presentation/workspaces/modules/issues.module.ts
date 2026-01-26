/**
 * Issues Module - Defect & Issue Tracking
 * Layer: Presentation
 * Events: Reacts to QCFailed/AcceptanceRejected, Publishes IssueCreated/IssueResolved
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IssuesStore } from '@application/issues/stores/issues.store';
import { CreateIssueUseCase } from '@application/issues/use-cases/create-issue.use-case';
import { ResolveIssueUseCase } from '@application/issues/use-cases/resolve-issue.use-case';
import { ModuleEventHelper } from '@presentation/workspaces/modules/basic/module-event-helper';

@Component({
  selector: 'app-issues-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="issues-module">
      <div class="module-header">
        <h2>🐛 Issues</h2>
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
            <p>{{ issue.resolution }}</p>
            <span>Resolved: {{ issue.resolvedAt?.toLocaleString() }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .issues-module { padding: 1.5rem; max-width: 1200px; }
    .module-header h2 { margin: 0 0 0.5rem 0; color: #1976d2; }
    .issues-section, .resolved-section { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
    .issue-card { border: 1px solid #e0e0e0; border-radius: 4px; padding: 1rem; margin-bottom: 1rem; }
    .issue-card[data-priority="high"], .issue-card[data-priority="critical"] { border-left: 4px solid #f44336; }
    .issue-card.resolved { background: #f1f8f4; }
    .issue-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    .issue-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
    .input-field { flex: 1; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    .btn-success { padding: 0.5rem 1rem; border: none; border-radius: 4px; background: #4caf50; color: white; cursor: pointer; }
    .empty-state { text-align: center; color: #999; padding: 2rem; }
  `]
})
export class IssuesModule implements IAppModule, OnInit, OnDestroy {
  readonly id = 'issues';
  readonly name = 'Issues';
  readonly type: ModuleType = 'issues';
  
  @Input() eventBus: IModuleEventBus | undefined;
  readonly issuesStore = inject(IssuesStore);
  private readonly createIssueUseCase = inject(CreateIssueUseCase);
  private readonly resolveIssueUseCase = inject(ResolveIssueUseCase);
  
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
        await this.createIssueUseCase.execute({
          issueId,
          taskId: event.aggregateId,
          workspaceId: eventBus.workspaceId,
          title: `QC Failed: ${event.payload.taskTitle}`,
          description: event.payload.failureReason,
          createdBy: this.currentUserId,
          correlationId: event.correlationId,
          causationId: event.eventId,
        });
      })
    );
    
    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.issuesStore.clearIssues();
      })
    );
    
  }
  
  async resolveIssue(issueId: string): Promise<void> {
    if (!this.eventBus || !this.resolution.trim()) {
      alert('Please provide resolution notes');
      return;
    }
    
    const issue = this.issuesStore.issues().find(i => i.id === issueId);
    if (!issue) return;
    
    await this.resolveIssueUseCase.execute({
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
