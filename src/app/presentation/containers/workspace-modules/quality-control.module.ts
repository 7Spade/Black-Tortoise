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
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { QualityControlStore } from '@application/quality-control/stores/quality-control.store';
import { createQCPassedEvent, createQCFailedEvent } from '@domain/events/domain-events';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';

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
          <div class="review-card" [class.passed]="task.reviewStatus === 'passed'">
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
  styles: [`
    .quality-control-module {
      padding: 1.5rem;
      max-width: 1200px;
    }
    
    .module-header h2 {
      margin: 0 0 0.5rem 0;
      color: #1976d2;
    }
    
    .module-header p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }
    
    .qc-tasks-section, .completed-reviews-section {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      margin-top: 1rem;
    }
    
    .qc-task-card, .review-card {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    
    .review-card.passed {
      border-color: #4caf50;
      background: #f1f8f4;
    }
    
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .task-header h4 {
      margin: 0;
      color: #333;
    }
    
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      background: #fff3e0;
      color: #f57c00;
    }
    
    .task-description {
      color: #666;
      margin: 0.5rem 0;
    }
    
    .task-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: #999;
      margin-bottom: 1rem;
    }
    
    .review-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    
    .input-field {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 0.875rem;
    }
    
    .btn-success, .btn-danger {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
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
    
    .review-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: #666;
      margin-top: 0.5rem;
    }
    
    .notes {
      margin-top: 0.5rem;
      font-style: italic;
      color: #666;
    }
  `]
})
export class QualityControlModule implements IAppModule, OnInit, OnDestroy {
  readonly id = 'quality-control';
  readonly name = 'Quality Control';
  readonly type: ModuleType = 'quality-control';
  
  /**
   * Event bus MUST be passed from parent - no injection
   */
  @Input() eventBus?: IModuleEventBus;
  
  /**
   * Inject QualityControl store
   */
  readonly qcStore = inject(QualityControlStore);
  
  /**
   * Form state
   */
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
    
    // Subscribe to TaskSubmittedForQC events
    this.subscriptions.add(
      eventBus.subscribe('TaskSubmittedForQC', (event: any) => {
        console.log('[QCModule] TaskSubmittedForQC:', event);
        this.qcStore.addTaskForReview({
          taskId: event.aggregateId,
          taskTitle: event.payload.taskTitle,
          taskDescription: event.payload.taskDescription || 'No description',
          submittedAt: new Date(event.timestamp),
          submittedBy: event.payload.submittedBy,
        });
      })
    );
    
    // Subscribe to workspace switched
    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.qcStore.clearTasks();
      })
    );
    
    ModuleEventHelper.publishModuleInitialized(eventBus, this.id);
    console.log(`[QCModule] Initialized`);
  }
  
  passQC(taskId: string): void {
    if (!this.eventBus) return;
    
    // Update store
    this.qcStore.passTask(taskId, this.currentUserId, this.reviewNotes);
    
    // Find task to get title
    const task = this.qcStore.tasks().find(t => t.taskId === taskId);
    if (!task) return;
    
    // Publish QCPassed event
    const event = createQCPassedEvent(
      taskId,
      this.eventBus.workspaceId,
      task.taskTitle,
      this.currentUserId,
      this.reviewNotes
    );
    
    this.eventBus.publish(event);
    this.reviewNotes = '';
  }
  
  failQC(taskId: string): void {
    if (!this.eventBus) return;
    if (!this.reviewNotes.trim()) {
      alert('Please provide review notes for failed QC');
      return;
    }
    
    // Update store
    this.qcStore.failTask(taskId, this.currentUserId, this.reviewNotes);
    
    // Find task to get title
    const task = this.qcStore.tasks().find(t => t.taskId === taskId);
    if (!task) return;
    
    // Publish QCFailed event
    const event = createQCFailedEvent(
      taskId,
      this.eventBus.workspaceId,
      task.taskTitle,
      this.reviewNotes,
      this.currentUserId
    );
    
    this.eventBus.publish(event);
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
