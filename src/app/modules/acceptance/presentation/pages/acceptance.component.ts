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
import { AcceptanceStore } from '@acceptance/application/stores/acceptance.store';
import { TasksStore } from '@tasks/application/stores/tasks.store';
import { ModuleEventHelper } from '@presentation/components/module-event-helper';

@Component({
  selector: 'app-acceptance-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="acceptance-module">
      <div class="module-header">
        <h2>??Acceptance</h2>
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
                ??Approve
              </button>
              <button
                (click)="rejectTask(item.check.taskId, item.taskTitle)"
                class="btn-danger"
              >
                ??Reject
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
  styleUrls: ['./acceptance.component.scss'],
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
