/**
 * Quality Control Module
 *
 * Layer: Presentation
 * Purpose: Quality assurance and control workflow
 *
 * Architecture:
 * - Injects QualityControlStore for state management
 * - Communicates via WorkspaceEventBus for cross-module events
 * - Event bus passed via @Input() from parent component
 * - Follows Append → Publish → React pattern
 *
 * Events Handled:
 * - Reacts to: TaskSubmittedForQC
 * - Publishes: QCPassed, QCFailed
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
import { FailQCHandler } from '@application/handlers/fail-qc.handler';
import { PassQCUseCase } from '@application/handlers/pass-qc.handler';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { QualityControlStore } from '@application/stores/quality-control.store';
import { ModuleEventHelper } from '@presentation/components/module-event-helper';

@Component({
  selector: 'app-quality-control-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="quality-control-module">
      <div class="module-header">
        <h2>🔍 Quality Control</h2>
        <p>Workspace: {{ eventBus?.workspaceId }}</p>
      </div>

      <!-- Pending QC Tasks -->
      <div class="qc-tasks-section">
        <h3>Pending QC Reviews ({{ qcStore.pendingTasks().length }})</h3>

        @if (qcStore.pendingTasks().length === 0) {
          <div class="empty-state">No tasks pending QC review</div>
        }

        @for (task of qcStore.pendingTasks(); track task.id) {
          <div class="qc-task-card">
            <div class="task-header">
              <h4>{{ task.taskTitle }}</h4>
              <span class="status-badge">{{ task.reviewStatus }}</span>
            </div>
            <p class="task-description">{{ task.taskDescription }}</p>
            <div class="task-meta">
              <span>Submitted: {{ task.submittedAt.toLocaleString() }}</span>
              <span>By: {{ task.submittedBy }}</span>
            </div>

            <div class="review-actions">
              <input
                type="text"
                [(ngModel)]="reviewNotes"
                placeholder="Review notes..."
                class="input-field"
              />
              <button (click)="passQC(task.taskId)" class="btn-success">
                ✓ Pass QC
              </button>
              <button (click)="failQC(task.taskId)" class="btn-danger">
                ✗ Fail QC
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Completed Reviews -->
      <div class="completed-reviews-section">
        <h3>Completed Reviews ({{ qcStore.completedReviews().length }})</h3>
        @for (task of qcStore.completedReviews(); track task.id) {
          <div
            class="review-card"
            [class.passed]="task.reviewStatus === 'passed'"
          >
            <h4>{{ task.taskTitle }}</h4>
            <div class="review-meta">
              <span class="status">{{ task.reviewStatus }}</span>
              <span>Reviewed: {{ task.reviewedAt?.toLocaleString() }}</span>
              <span>By: {{ task.reviewedBy }}</span>
            </div>
            @if (task.reviewNotes) {
              <p class="notes">{{ task.reviewNotes }}</p>
            }
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./quality-control.component.scss'],
})
export class QualityControlComponent implements IAppModule, OnInit, OnDestroy {
  readonly id = 'quality-control';
  readonly name = 'Quality Control';
  readonly type: ModuleType = 'quality-control';

  @Input() eventBus: IModuleEventBus | undefined;

  readonly qcStore = inject(QualityControlStore);
  private readonly passQCUseCase = inject(PassQCUseCase);
  private readonly failQCHandler = inject(FailQCHandler);

  reviewNotes = '';

  private readonly currentUserId = 'user-demo-qc';
  private subscriptions = ModuleEventHelper.createSubscriptionManager();

  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }

  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;

    this.subscriptions.add(
      eventBus.subscribe('TaskSubmittedForQC', (event: any) => {
        console.log('[QCModule] TaskSubmittedForQC:', event);
      }),
    );

    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.qcStore.clearTasks();
      }),
    );

    console.log(`[QCModule] Initialized`);
  }

  async passQC(taskId: string): Promise<void> {
    if (!this.eventBus) return;

    const task = this.qcStore.tasks().find((t) => t.taskId === taskId);
    if (!task) return;

    await this.passQCUseCase.execute({
      taskId,
      workspaceId: this.eventBus.workspaceId,
      taskTitle: task.taskTitle,
      reviewedBy: this.currentUserId,
      reviewNotes: this.reviewNotes,
    });

    this.reviewNotes = '';
  }

  async failQC(taskId: string): Promise<void> {
    if (!this.eventBus) return;
    if (!this.reviewNotes.trim()) {
      alert('Please provide review notes for failed QC');
      return;
    }

    const task = this.qcStore.tasks().find((t) => t.taskId === taskId);
    if (!task) return;

    await this.failQCHandler.execute({
      taskId,
      workspaceId: this.eventBus.workspaceId,
      taskTitle: task.taskTitle,
      failureReason: this.reviewNotes,
      reviewedBy: this.currentUserId,
    });

    this.reviewNotes = '';
  }

  activate(): void {
    console.log(`[QCModule] Activated`);
  }

  deactivate(): void {
    console.log(`[QCModule] Deactivated`);
  }

  destroy(): void {
    this.subscriptions.unsubscribeAll();
    console.log(`[QCModule] Destroyed`);
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
