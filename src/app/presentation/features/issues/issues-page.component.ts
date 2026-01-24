/**
 * Issues Page Component
 *
 * Layer: Presentation
 * Purpose: Issue tracking interface
 * Architecture: Zone-less, Signal-based
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';

import { IssuesStore } from '@application/issues/stores/issues.store';
import { WorkspaceContextStore } from '@application/workspace/stores/workspace-context.store';
import { WORKSPACE_RUNTIME_FACTORY } from '@application/workspace/tokens/workspace-runtime.token';

@Component({
  selector: 'app-issues-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatBadgeModule,
  ],
  template: `
    <div class="issues-page">
      <header class="page-header">
        <h1>Issues</h1>
        <div class="stats">
          <mat-chip-set>
            <mat-chip [highlighted]="store.openIssues().length > 0">
              Open: {{ store.openIssues().length }}
            </mat-chip>
            <mat-chip>
              In Progress: {{ store.inProgressIssues().length }}
            </mat-chip>
            <mat-chip appearance="outlined">
              Resolved: {{ store.resolvedIssues().length }}
            </mat-chip>
          </mat-chip-set>
        </div>
        <button mat-raised-button color="primary" (click)="createIssue()">
          <mat-icon>add</mat-icon>
          New Issue
        </button>
      </header>

      <div class="content">
        <mat-card>
          <mat-card-content>
            @if (store.issues().length === 0) {
              <p class="empty-state">No issues found</p>
            } @else {
              <mat-list>
                @for (issue of store.issues(); track issue.issueId) {
                  <mat-list-item (click)="selectIssue(issue.issueId)">
                    <mat-icon matListItemIcon [color]="getSeverityColor(issue.severity)">bug_report</mat-icon>
                    <span matListItemTitle>{{ issue.title }}</span>
                    <span matListItemLine>{{ issue.relatedTaskTitle }}</span>
                    <mat-chip matListItemMeta>{{ issue.status }}</mat-chip>
                  </mat-list-item>
                }
              </mat-list>
            }
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .issues-page {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      color: rgba(0, 0, 0, 0.6);
    }
  `],
})
export class IssuesPageComponent {
  readonly store = inject(IssuesStore);
  private readonly workspaceStore = inject(WorkspaceContextStore);
  private readonly runtimeFactory = inject(WORKSPACE_RUNTIME_FACTORY);

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'warn';
      case 'high': return 'warn';
      case 'medium': return 'accent';
      default: return 'primary';
    }
  }

  selectIssue(issueId: string): void {
    this.store.selectIssue(issueId);
  }

  createIssue(): void {
    const title = prompt('Issue title:');
    if (!title) return;

    const workspaceId = this.workspaceStore.currentWorkspace()?.id;
    if (!workspaceId) return;

    const runtime = this.runtimeFactory.getRuntime(workspaceId);
    if (!runtime) return;

    this.store.createIssue({
      title,
      description: '',
      relatedTaskId: 'task-demo',
      relatedTaskTitle: 'Demo Task',
      severity: 'medium',
      createdById: this.workspaceStore.currentIdentityId() || 'demo-user',
      workspaceId,
      eventBus: runtime.eventBus,
      eventStore: runtime.eventStore,
    });
  }
}
