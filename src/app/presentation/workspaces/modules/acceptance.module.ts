/**
 * Acceptance Module
 * 
 * Layer: Presentation
 * Purpose: Final acceptance workflow for completed tasks
 * 
 * Architecture:
 * - Injects AcceptanceStore for state management (READ-ONLY)
 * - Delegates actions to Use Cases (event-driven)
 * - Communicates via WorkspaceEventBus for cross-module events
 * - Event bus passed via @Input() from parent component
 * - Follows Append → Publish → React pattern
 * 
 * Events Handled:
 * - Reacts to: QCPassed (only QC-passed tasks can enter acceptance)
 * - Use Cases publish: AcceptanceApproved, AcceptanceRejected
 * 
 * DDD Boundary:
 * - NO direct event publishing
 * - NO state mutations
 * - ALL actions via Application Use Cases
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AcceptanceStore } from '@application/acceptance/stores/acceptance.store';
import { ApproveTaskUseCase } from '@application/acceptance/use-cases/approve-task.use-case';
import { RejectTaskUseCase } from '@application/acceptance/use-cases/reject-task.use-case';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { ModuleEventHelper } from '@presentation/workspaces/modules/basic/module-event-helper';

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
        <h3>Pending Acceptance ({{ acceptanceStore.pendingTasks().length }})</h3>
        
        @if (acceptanceStore.pendingTasks().length === 0) {
          <div class="empty-state">No tasks pending acceptance</div>
        }
        
        @for (task of acceptanceStore.pendingTasks(); track task.id) {
          <div class="acceptance-card">
            <div class="task-header">
              <h4>{{ task.taskTitle }}</h4>
              <span class="status-badge">{{ task.acceptanceStatus }}</span>
            </div>
            <p>{{ task.taskDescription }}</p>
            <div class="task-meta">
              <span>QC Passed: {{ task.qcPassedAt.toLocaleString() }}</span>
              <span>Reviewed by: {{ task.qcReviewedBy }}</span>
            </div>
            
            <div class="acceptance-actions">
              <input 
                type="text" 
                [(ngModel)]="notes"
                placeholder="Acceptance notes..."
                class="input-field"
              />
              <button (click)="approveTask(task.taskId)" class="btn-success">
                ✓ Approve
              </button>
              <button (click)="rejectTask(task.taskId)" class="btn-danger">
                ✗ Reject
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Completed -->
      <div class="completed-section">
        <h3>Completed ({{ completedTasksCount() }})</h3>
        @for (task of completedTasks(); track task.id) {
          <div class="result-card" [class.approved]="task.acceptanceStatus === 'approved'">
            <h4>{{ task.taskTitle }}</h4>
            <div class="result-meta">
              <span class="status">{{ task.acceptanceStatus }}</span>
              <span>{{ task.decidedAt?.toLocaleString() }}</span>
              <span>By: {{ task.decidedBy }}</span>
            </div>
            @if (task.notes) {
              <p class="notes">{{ task.notes }}</p>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .acceptance-module {
      padding: 1.5rem;
      max-width: 1200px;
    }
    .module-header h2 {
      margin: 0 0 0.5rem 0;
      color: #1976d2;
    }
    .acceptance-section, .completed-section {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      margin-top: 1rem;
    }
    .acceptance-card, .result-card {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .result-card.approved {
      border-color: #4caf50;
      background: #f1f8f4;
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
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .btn-success, .btn-danger {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    .btn-success {
      background: #4caf50;
      color: white;
    }
    .btn-danger {
      background: #f44336;
      color: white;
    }
    .empty-state {
      text-align: center;
      color: #999;
      padding: 2rem;
    }
  `]
})
export class AcceptanceModule implements IAppModule, OnInit, OnDestroy {
  readonly id = 'acceptance';
  readonly name = 'Acceptance';
  readonly type: ModuleType = 'acceptance';
  
  @Input() eventBus?: IModuleEventBus;
  
  readonly acceptanceStore = inject(AcceptanceStore);
  private readonly approveTaskUseCase = inject(ApproveTaskUseCase);
  private readonly rejectTaskUseCase = inject(RejectTaskUseCase);
  
  // Computed signal for completed tasks (approved + rejected)
  readonly completedTasks = computed(() => [
    ...this.acceptanceStore.approvedTasks(),
    ...this.acceptanceStore.rejectedTasks()
  ]);
  
  readonly completedTasksCount = computed(() => 
    this.acceptanceStore.approvedTasks().length + this.acceptanceStore.rejectedTasks().length
  );
  
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
      })
    );
    
    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.acceptanceStore.clearTasks();
      })
    );
    
  }
  
  approveTask(taskId: string): void {
    if (!this.eventBus) return;
    
    const task = this.acceptanceStore.tasks().find(t => t.taskId === taskId);
    if (!task) return;
    
    const request: Parameters<typeof this.approveTaskUseCase.execute>[0] = {
      taskId,
      workspaceId: this.eventBus.workspaceId,
      taskTitle: task.taskTitle,
      approverId: this.currentUserId,
      ...(this.notes ? { approvalNotes: this.notes } : {}),
    };
    
    this.approveTaskUseCase.execute(request).then(result => {
      if (!result.success) {
        console.error('[AcceptanceModule] Approve failed:', result.error);
      }
    });
    
    this.notes = '';
  }
  
  rejectTask(taskId: string): void {
    if (!this.eventBus || !this.notes.trim()) {
      alert('Please provide rejection reason');
      return;
    }
    
    const task = this.acceptanceStore.tasks().find(t => t.taskId === taskId);
    if (!task) return;
    
    // Delegate to Use Case - creates event, appends to store, publishes to bus
    this.rejectTaskUseCase.execute({
      taskId,
      workspaceId: this.eventBus.workspaceId,
      taskTitle: task.taskTitle,
      rejectedById: this.currentUserId,
      rejectionReason: this.notes,
    }).then(result => {
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
