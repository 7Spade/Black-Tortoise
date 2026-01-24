/**
 * Quality Control Page Component
 *
 * Layer: Presentation
 * Purpose: QC review interface
 * Architecture: Zone-less, Signal-based
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';

import { QualityControlStore } from '@application/quality-control/stores/quality-control.store';
import { WorkspaceContextStore } from '@application/workspace/stores/workspace-context.store';
import { WORKSPACE_RUNTIME_FACTORY } from '@application/workspace/tokens/workspace-runtime.token';

@Component({
  selector: 'app-quality-control-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatBadgeModule,
  ],
  template: `
    <div class="quality-control-page">
      <header class="page-header">
        <h1>Quality Control</h1>
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
              <mat-card-subtitle>Submitted {{ review.submittedAt | date:'short' }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ review.taskDescription }}</p>
            </mat-card-content>
            <mat-card-actions>
              <mat-form-field class="review-notes">
                <mat-label>Review Notes</mat-label>
                <textarea matInput [value]="reviewNotes()" (input)="reviewNotes.set($any($event.target).value)"></textarea>
              </mat-form-field>
              <div class="actions">
                <button mat-raised-button color="primary" (click)="passReview(review.taskId)">
                  <mat-icon>check_circle</mat-icon>
                  Pass
                </button>
                <button mat-raised-button color="warn" (click)="failReview(review.taskId)">
                  <mat-icon>cancel</mat-icon>
                  Fail
                </button>
              </div>
            </mat-card-actions>
          </mat-card>
        } @else {
          <mat-card class="queue-card">
            <mat-card-header>
              <mat-card-title>Review Queue</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @if (store.reviewQueue().length === 0) {
                <p class="empty-state">No items in queue</p>
              } @else {
                <mat-list>
                  @for (item of store.reviewQueue(); track item.taskId) {
                    <mat-list-item (click)="startReview(item.taskId)">
                      <span matListItemTitle>{{ item.taskTitle }}</span>
                      <span matListItemLine>{{ item.submittedAt | date:'short' }}</span>
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
    .quality-control-page {
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

    .review-notes {
      width: 100%;
      margin-bottom: 16px;
    }

    .actions {
      display: flex;
      gap: 12px;
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
export class QualityControlPageComponent {
  readonly store = inject(QualityControlStore);
  private readonly workspaceStore = inject(WorkspaceContextStore);
  private readonly runtimeFactory = inject(WORKSPACE_RUNTIME_FACTORY);
  
  readonly reviewNotes = signal('');

  startReview(taskId: string): void {
    const userId = this.workspaceStore.currentIdentityId() || 'demo-user';
    this.store.startReview(taskId, userId);
    this.reviewNotes.set('');
  }

  passReview(taskId: string): void {
    const workspaceId = this.workspaceStore.currentWorkspace()?.id;
    if (!workspaceId) return;

    const runtime = this.runtimeFactory.getRuntime(workspaceId);
    if (!runtime) return;

    const userId = this.workspaceStore.currentIdentityId() || 'demo-user';
    
    this.store.passReview({
      taskId,
      reviewerId: userId,
      reviewNotes: this.reviewNotes() || undefined,
      workspaceId,
      eventBus: runtime.eventBus,
      eventStore: runtime.eventStore,
    });

    this.reviewNotes.set('');
  }

  failReview(taskId: string): void {
    const reason = this.reviewNotes();
    if (!reason) {
      alert('Please provide a failure reason');
      return;
    }

    const workspaceId = this.workspaceStore.currentWorkspace()?.id;
    if (!workspaceId) return;

    const runtime = this.runtimeFactory.getRuntime(workspaceId);
    if (!runtime) return;

    const userId = this.workspaceStore.currentIdentityId() || 'demo-user';
    
    this.store.failReview({
      taskId,
      reviewerId: userId,
      failureReason: reason,
      workspaceId,
      eventBus: runtime.eventBus,
      eventStore: runtime.eventStore,
    });

    this.reviewNotes.set('');
  }
}
