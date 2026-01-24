/**
 * Acceptance Page Component
 *
 * Layer: Presentation
 * Purpose: Acceptance testing interface
 * Architecture: Zone-less, Signal-based
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { AcceptanceStore } from '@application/acceptance/stores/acceptance.store';
import { WorkspaceContextStore } from '@application/workspace/stores/workspace-context.store';
import { WORKSPACE_RUNTIME_FACTORY } from '@application/workspace/tokens/workspace-runtime.token';

@Component({
  selector: 'app-acceptance-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
  ],
  template: `
    <div class="acceptance-page">
      <header class="page-header">
        <h1>Acceptance Testing</h1>
        <div class="stats">
          <mat-chip-set>
            <mat-chip [highlighted]="store.pendingCount() > 0">
              Pending: {{ store.pendingCount() }}
            </mat-chip>
            <mat-chip>
              Reviewing: {{ store.reviewingCount() }}
            </mat-chip>
            <mat-chip appearance="outlined">
              Passed: {{ store.passedCount() }}
            </mat-chip>
            <mat-chip appearance="outlined">
              Failed: {{ store.failedCount() }}
            </mat-chip>
          </mat-chip-set>
        </div>
      </header>

      <div class="content">
        @if (store.currentReview(); as review) {
          <mat-card class="review-card">
            <mat-card-header>
              <mat-card-title>{{ review.taskTitle }}</mat-card-title>
              <mat-card-subtitle>Acceptance Criteria</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="checklist">
                @for (item of review.checklistItems; track item) {
                  <mat-checkbox
                    [checked]="review.completedItems.includes(item)"
                    (change)="toggleItem(review.taskId, item)">
                    {{ item }}
                  </mat-checkbox>
                }
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button 
                mat-raised-button 
                color="primary" 
                [disabled]="review.completedItems.length !== review.checklistItems.length"
                (click)="passReview(review.taskId)">
                <mat-icon>check_circle</mat-icon>
                Accept
              </button>
              <button mat-raised-button color="warn" (click)="failReview(review.taskId)">
                <mat-icon>cancel</mat-icon>
                Reject
              </button>
            </mat-card-actions>
          </mat-card>
        } @else {
          <mat-card class="queue-card">
            <mat-card-header>
              <mat-card-title>Acceptance Queue</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @if (store.acceptanceQueue().length === 0) {
                <p class="empty-state">No items pending acceptance</p>
              } @else {
                <mat-list>
                  @for (item of store.acceptanceQueue(); track item.taskId) {
                    <mat-list-item (click)="startReview(item.taskId)">
                      <span matListItemTitle>{{ item.taskTitle }}</span>
                      <span matListItemLine>
                        {{ item.completedItems.length }}/{{ item.checklistItems.length }} criteria met
                      </span>
                      <button mat-icon-button matListItemMeta>
                        <mat-icon>arrow_forward</mat-icon>
                      </button>
                    </mat-list-item>
                  }
                </mat-list>
              }
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .acceptance-page {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h1 {
      margin: 0 0 16px 0;
    }

    .review-card, .queue-card {
      margin-bottom: 16px;
    }

    .checklist {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px 0;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      color: rgba(0, 0, 0, 0.6);
    }

    mat-list-item {
      cursor: pointer;
    }

    mat-list-item:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `],
})
export class AcceptancePageComponent {
  readonly store = inject(AcceptanceStore);
  private readonly workspaceStore = inject(WorkspaceContextStore);
  private readonly runtimeFactory = inject(WORKSPACE_RUNTIME_FACTORY);

  startReview(taskId: string): void {
    this.store.startReview(taskId);
  }

  toggleItem(taskId: string, item: string): void {
    this.store.toggleChecklistItem(taskId, item);
  }

  passReview(taskId: string): void {
    const workspaceId = this.workspaceStore.currentWorkspace()?.id;
    if (!workspaceId) return;

    const runtime = this.runtimeFactory.getRuntime(workspaceId);
    if (!runtime) return;

    const userId = this.workspaceStore.currentIdentityId() || 'demo-user';
    
    this.store.passReview({
      taskId,
      acceptedById: userId,
      workspaceId,
      eventBus: runtime.eventBus,
      eventStore: runtime.eventStore,
    });
  }

  failReview(taskId: string): void {
    const reason = prompt('Rejection reason:');
    if (!reason) return;

    const workspaceId = this.workspaceStore.currentWorkspace()?.id;
    if (!workspaceId) return;

    const runtime = this.runtimeFactory.getRuntime(workspaceId);
    if (!runtime) return;

    const userId = this.workspaceStore.currentIdentityId() || 'demo-user';
    const currentReview = this.store.currentReview();
    const failedItems = currentReview?.checklistItems.filter(
      item => !currentReview.completedItems.includes(item)
    ) || [];
    
    this.store.failReview({
      taskId,
      rejectedById: userId,
      failureReason: reason,
      failedItems,
      workspaceId,
      eventBus: runtime.eventBus,
      eventStore: runtime.eventStore,
    });
  }
}
