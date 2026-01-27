/**
 * Acceptance Module
 *
 * Layer: Presentation
 * Purpose: Final acceptance workflow for completed tasks
 *
 * Architecture:
 * - Injects AcceptanceStore for state management (READ-ONLY)
 * - Injects TasksStore for Denormalization (Task Titles)
 * - Delegates actions to Use Cases (event-driven)
 * - Communicates via WorkspaceEventBus for cross-module events
 */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApproveTaskHandler } from '@application/handlers/approve-task.handler';
import { RejectTaskHandler } from '@application/handlers/reject-task.handler';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { AcceptanceStore } from '@application/stores/acceptance.store';
import { TasksStore } from '@application/stores/tasks.store';
import { ModuleEventHelper } from '@presentation/components/module-event-helper';

@Component({
  selector: 'app-acceptance-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="acceptance-module">
      <div class="module-header">
        <h2>✅ Acceptance</h2>
        <p>Workspace: {{ eventBus?.workspaceId }}</p>
      </div>

      <!-- Pending Acceptance -->
      <div class="acceptance-section">
        <h3>Pending Acceptance ({{ pendingChecksView().length }})</h3>

        @if (pendingChecksView().length === 0) {
          <div class="empty-state">No tasks pending acceptance</div>
        }

        @for (item of pendingChecksView(); track item.check.id) {
          <div class="acceptance-card">
            <div class="task-header">
              <h4>{{ item.taskTitle }}</h4>
              <span class="status-badge">{{ item.check.status }}</span>
            </div>
            <p>{{ item.taskDescription }}</p>
            <div class="task-meta">
              <span>Criteria: {{ item.check.criteria.join(', ') }}</span>
            </div>

            <div class="acceptance-actions">
              <input
                type="text"
                [(ngModel)]="notes"
                placeholder="Acceptance notes..."
                class="input-field"
              />
              <button
                (click)="approveTask(item.check.taskId, item.taskTitle)"
                class="btn-success"
              >
                ✓ Approve
              </button>
              <button
                (click)="rejectTask(item.check.taskId, item.taskTitle)"
                class="btn-danger"
              >
                ✗ Reject
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Completed -->
      <div class="completed-section">
        <h3>Completed ({{ completedChecksView().length }})</h3>
        @for (item of completedChecksView(); track item.check.id) {
          <div
            class="result-card"
            [class.approved]="item.check.status === 'approved'"
          >
            <h4>{{ item.taskTitle }}</h4>
            <div class="result-meta">
              <span class="status">{{ item.check.status }}</span>
              <span>{{
                item.check.reviewedAt ? (item.check.reviewedAt | date) : 'N/A'
              }}</span>
              <span>By: {{ item.check.reviewedBy }}</span>
            </div>
            @if (item.check.notes) {
              <p class="notes">{{ item.check.notes }}</p>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .acceptance-module {
        padding: 1.5rem;
        max-width: 1200px;
      }
      .module-header h2 {
        margin: 0 0 0.5rem 0;
        color: var(--md-sys-color-primary);
      }
      .acceptance-section,
      .completed-section {
        background: var(--md-sys-color-surface);
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: 8px;
        padding: 1.5rem;
        margin-top: 1rem;
      }
      .acceptance-card,
      .result-card {
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: 4px;
        padding: 1rem;
        margin-bottom: 1rem;
      }
      .result-card.approved {
        border-color: var(--md-sys-color-tertiary);
        background: var(--md-sys-color-surface-variant);
      }
      .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .acceptance-actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin-top: 1rem;
      }
      .input-field {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid var(--md-sys-color-outline);
        border-radius: 4px;
      }
      .btn-success,
      .btn-danger {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
      }
      .btn-success {
        background: var(--md-sys-color-tertiary);
        color: var(--md-sys-color-on-tertiary);
      }
      .btn-danger {
        background: var(--md-sys-color-error);
        color: var(--md-sys-color-on-error);
      }
      .empty-state {
        text-align: center;
        color: var(--md-sys-color-on-surface-variant);
        padding: 2rem;
      }
    `,
  ],
})
export class AcceptanceComponent implements IAppModule, OnInit, OnDestroy {
  readonly id = 'acceptance';
  readonly name = 'Acceptance';
  readonly type: ModuleType = 'acceptance';

  @Input() eventBus: IModuleEventBus | undefined;

  readonly acceptanceStore = inject(AcceptanceStore);
  readonly tasksStore = inject(TasksStore);
  private readonly approveTaskHandler = inject(ApproveTaskHandler);
  private readonly rejectTaskHandler = inject(RejectTaskHandler);

  // ViewModel: Join Checks with Task Data
  readonly pendingChecksView = computed(() => {
    const checks = this.acceptanceStore.pendingChecks();
    const tasks = this.tasksStore.tasks();
    return checks.map((check) => {
      const task = tasks.find((t) => t.id === check.taskId);
      return {
        check,
        taskTitle: task?.title ?? 'Unknown Task',
        taskDescription: task?.description ?? 'No description',
      };
    });
  });

  readonly completedChecksView = computed(() => {
    const checks = [
      ...this.acceptanceStore.approvedChecks(),
      ...this.acceptanceStore.rejectedChecks(),
    ];
    const tasks = this.tasksStore.tasks();
    return checks.map((check) => {
      const task = tasks.find((t) => t.id === check.taskId);
      return {
        check,
        taskTitle: task?.title ?? 'Unknown Task',
      };
    });
  });

  notes = '';
  private readonly currentUserId = 'user-demo-acceptance';
  private subscriptions = ModuleEventHelper.createSubscriptionManager();

  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }

  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;

    this.subscriptions.add(
      eventBus.subscribe('QCPassed', (event: any) => {
        console.log('[AcceptanceModule] QCPassed event received:', event);
      }),
    );

    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.acceptanceStore.reset();
      }),
    );
  }

  approveTask(taskId: string, taskTitle: string): void {
    if (!this.eventBus) return;

    // Check exists in view, so we proceed directly
    const request: Parameters<typeof this.approveTaskHandler.execute>[0] = {
      taskId,
      workspaceId: this.eventBus.workspaceId,
      taskTitle: taskTitle,
      approverId: this.currentUserId,
      ...(this.notes ? { approvalNotes: this.notes } : {}),
    };

    this.approveTaskHandler.execute(request).then((result) => {
      if (!result.success) {
        console.error('[AcceptanceModule] Approve failed:', result.error);
      }
    });

    this.notes = '';
  }

  rejectTask(taskId: string, taskTitle: string): void {
    if (!this.eventBus || !this.notes.trim()) {
      alert('Please provide rejection reason');
      return;
    }

    // Delegate to Use Case - creates event, appends to store, publishes to bus
    this.rejectTaskHandler
      .execute({
        taskId,
        workspaceId: this.eventBus.workspaceId,
        taskTitle: taskTitle,
        rejectedById: this.currentUserId,
        rejectionReason: this.notes,
      })
      .then((result) => {
        if (!result.success) {
          console.error('[AcceptanceModule] Reject failed:', result.error);
        }
      });

    this.notes = '';
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
