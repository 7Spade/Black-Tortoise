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
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateIssueHandler } from '@application/handlers/create-issue.handler';
import { ResolveIssueHandler } from '@application/handlers/resolve-issue.handler';
import { ReopenIssueHandler } from '@application/handlers/reopen-issue.handler';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { IssuesStore } from '@application/stores/issues.store';
import { IssuePriority, IssueStatus, IssueType } from '@domain/aggregates';
import { ModuleEventHelper } from '@presentation/components/module-event-helper';

@Component({
  selector: 'app-issues-module',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="issues-module p-6">
      <!-- Header -->
      <div class="module-header mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">🐛 Issues</h2>
            <p class="text-gray-600">Workspace: {{ eventBus?.workspaceId }}</p>
          </div>
          <button
            mat-raised-button
            color="primary"
            (click)="openCreateDialog()"
          >
            <mat-icon>add</mat-icon>
            Create Issue
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section mb-6 p-4 bg-gray-50 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Status Filter -->
          <mat-form-field>
            <mat-label>Status</mat-label>
            <mat-select
              [value]="issuesStore.filterStatus()"
              (valueChange)="issuesStore.filterByStatus($event)"
            >
              <mat-option [value]="null">All</mat-option>
              @for (status of statuses; track status) {
                <mat-option [value]="status">{{ status }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <!-- Type Filter -->
          <mat-form-field>
            <mat-label>Type</mat-label>
            <mat-select
              [value]="issuesStore.filterType()"
              (valueChange)="issuesStore.filterByType($event)"
            >
              <mat-option [value]="null">All</mat-option>
              @for (type of types; track type) {
                <mat-option [value]="type">{{ type }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <!-- Priority Filter -->
          <mat-form-field>
            <mat-label>Priority</mat-label>
            <mat-select
              [value]="issuesStore.filterPriority()"
              (valueChange)="issuesStore.filterByPriority($event)"
            >
              <mat-option [value]="null">All</mat-option>
              @for (priority of priorities; track priority) {
                <mat-option [value]="priority">{{ priority }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <!-- Search -->
          <mat-form-field>
            <mat-label>Search</mat-label>
            <input
              matInput
              [value]="issuesStore.searchQuery()"
              (input)="onSearchChange($event)"
              placeholder="Search title or description..."
            />
            @if (issuesStore.searchQuery()) {
              <button
                matSuffix
                mat-icon-button
                (click)="issuesStore.searchIssues('')"
              >
                <mat-icon>clear</mat-icon>
              </button>
            }
          </mat-form-field>
        </div>

        <div class="flex justify-end mt-2">
          <button
            mat-button
            (click)="issuesStore.clearFilters()"
            [disabled]="!hasActiveFilters()"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Issue List -->
      <div class="issues-list">
        <h3 class="text-lg font-semibold mb-4">
          Issues ({{ issuesStore.filteredIssues().length }})
        </h3>

        @if (issuesStore.filteredIssues().length === 0) {
          <div class="empty-state text-center p-8 text-gray-500">
            @if (hasActiveFilters()) {
              <p>No issues match the current filters</p>
            } @else {
              <p>No issues found</p>
            }
          </div>
        }

        @for (issue of issuesStore.filteredIssues(); track issue.id) {
          <mat-card class="issue-card mb-4">
            <mat-card-header>
              <mat-card-title class="flex justify-between items-center">
                <span>{{ issue.title }}</span>
                <div class="flex gap-2">
                  <mat-chip [class]="'priority-' + issue.priority">
                    {{ issue.priority }}
                  </mat-chip>
                  <mat-chip [class]="'status-' + issue.status">
                    {{ issue.status }}
                  </mat-chip>
                </div>
              </mat-card-title>
              <mat-card-subtitle>
                <span class="type-badge">{{ issue.type }}</span>
                @if (issue.taskId) {
                  <span class="ml-2">Task: {{ issue.taskId }}</span>
                }
              </mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <p>{{ issue.description }}</p>
              <div class="issue-meta text-sm text-gray-600 mt-2">
                <span>Created: {{ formatDate(issue.createdAt) }}</span>
                @if (issue.resolvedAt) {
                  <span class="ml-4">
                    Resolved: {{ formatDate(issue.resolvedAt) }}
                  </span>
                }
              </div>
            </mat-card-content>

            <mat-card-actions>
              @switch (issue.status) {
                @case ('open') {
                  <button
                    mat-button
                    color="primary"
                    (click)="resolveIssue(issue.id)"
                  >
                    <mat-icon>check_circle</mat-icon>
                    Resolve
                  </button>
                }
                @case ('in-progress') {
                  <button
                    mat-button
                    color="primary"
                    (click)="resolveIssue(issue.id)"
                  >
                    <mat-icon>check_circle</mat-icon>
                    Resolve
                  </button>
                }
                @case ('reopened') {
                  <button
                    mat-button
                    color="primary"
                    (click)="resolveIssue(issue.id)"
                  >
                    <mat-icon>check_circle</mat-icon>
                    Resolve
                  </button>
                }
                @case ('resolved') {
                  <button
                    mat-button
                    color="accent"
                    (click)="reopenIssue(issue.id)"
                  >
                    <mat-icon>refresh</mat-icon>
                    Reopen
                  </button>
                }
                @case ('closed') {
                  <button
                    mat-button
                    color="accent"
                    (click)="reopenIssue(issue.id)"
                  >
                    <mat-icon>refresh</mat-icon>
                    Reopen
                  </button>
                }
              }
            </mat-card-actions>
          </mat-card>
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
  private readonly reopenIssueHandler = inject(ReopenIssueHandler);
  private readonly dialog = inject(MatDialog);

  private readonly currentUserId = 'user-demo-issues';
  private subscriptions = ModuleEventHelper.createSubscriptionManager();

  readonly statuses = Object.values(IssueStatus);
  readonly types = Object.values(IssueType);
  readonly priorities = Object.values(IssuePriority);

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
      eventBus.subscribe('AcceptanceRejected', async (event: any) => {
        const issueId = crypto.randomUUID();
        await this.createIssueHandler.execute({
          issueId,
          taskId: event.aggregateId,
          workspaceId: eventBus.workspaceId,
          title: `Acceptance Failed: ${event.payload.taskTitle}`,
          description: event.payload.rejectionReason,
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
    if (!this.eventBus) return;

    const issue = this.issuesStore.issues().find((i) => i.id === issueId);
    if (!issue || !issue.taskId) return;

    await this.resolveIssueHandler.execute({
      issueId,
      taskId: issue.taskId,
      workspaceId: this.eventBus.workspaceId,
      resolvedBy: this.currentUserId,
      resolution: 'Resolved',
    });
  }

  async reopenIssue(issueId: string): Promise<void> {
    if (!this.eventBus) return;

    await this.reopenIssueHandler.execute({
      issueId,
      workspaceId: this.eventBus.workspaceId,
      reopenedBy: this.currentUserId,
      reopenReason: 'Issue verification failed',
    });
  }

  openCreateDialog(): void {
    // Placeholder for manual create dialog
    // In production, this would open a proper Material Dialog
    const title = prompt('Issue Title:');
    const description = prompt('Issue Description:');
    
    if (title && description && this.eventBus) {
      const issueId = crypto.randomUUID();
      this.createIssueHandler.execute({
        issueId,
        workspaceId: this.eventBus.workspaceId,
        title,
        description,
        createdBy: this.currentUserId,
      });
    }
  }

  onSearchChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.issuesStore.searchIssues(query);
  }

  hasActiveFilters(): boolean {
    return !!(
      this.issuesStore.filterStatus() ||
      this.issuesStore.filterType() ||
      this.issuesStore.filterPriority() ||
      this.issuesStore.filterAssigneeId() ||
      this.issuesStore.searchQuery()
    );
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
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
