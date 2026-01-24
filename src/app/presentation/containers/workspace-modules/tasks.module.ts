/**
 * Tasks Module - Phase 2 Vertical Slice
 * 
 * Layer: Presentation
 * Purpose: Complete task management with feedback loop
 * Architecture: Workspace-scoped, Event-driven, Pure Signal-based, NO RxJS
 * 
 * Implements: Task→QC→Fail→Issue→Task Ready feedback loop
 * 
 * Constitution Compliance:
 * - No manual .subscribe() calls
 * - Pure signal-based event handling via unsubscribe functions
 * - Zone-less compatible
 * - Event handlers stored and cleaned up properly
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { createTask, TaskEntity, TaskPriority, TaskStatus, updateTaskStatus } from '@domain/task/task.entity';
import { createTaskCreatedEvent } from '@domain/events/domain-events/task-created.event';
import { createTaskSubmittedForQCEvent } from '@domain/events/domain-events/task-submitted-for-qc.event';
import { createQCFailedEvent } from '@domain/events/domain-events/qc-failed.event';
import { createIssueCreatedEvent } from '@domain/events/domain-events/issue-created.event';
import { createIssueResolvedEvent } from '@domain/events/domain-events/issue-resolved.event';

@Component({
  selector: 'app-tasks-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tasks-module">
      <div class="module-header">
        <h2>📋 Tasks Module</h2>
        <p>Workspace: {{ workspaceId() }}</p>
      </div>

      <!-- Create Task Form -->
      <div class="create-task-card">
        <h3>Create New Task</h3>
        <div class="form-group">
          <label>Title</label>
          <input 
            type="text" 
            [(ngModel)]="newTaskTitle" 
            placeholder="Enter task title"
            class="input-field"
          />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea 
            [(ngModel)]="newTaskDescription" 
            placeholder="Enter task description"
            class="input-field"
          ></textarea>
        </div>
        <div class="form-group">
          <label>Priority</label>
          <select [(ngModel)]="newTaskPriority" class="input-field">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <button (click)="createNewTask()" class="btn-primary">
          Create Task
        </button>
      </div>

      <!-- Tasks List -->
      <div class="tasks-list">
        <h3>Tasks ({{ tasks().length }})</h3>
        @if (tasks().length === 0) {
          <div class="empty-state">No tasks yet. Create one above!</div>
        }
        @for (task of tasks(); track task.id) {
          <div class="task-card" [class.blocked]="task.status === 'blocked'">
            <div class="task-header">
              <h4>{{ task.title }}</h4>
              <span class="status-badge" [attr.data-status]="task.status">
                {{ task.status }}
              </span>
            </div>
            <p class="task-description">{{ task.description }}</p>
            <div class="task-meta">
              <span class="priority" [attr.data-priority]="task.priority">
                {{ task.priority }}
              </span>
              <span class="task-id">ID: {{ task.id.substring(0, 8) }}</span>
            </div>
            
            <!-- Feedback Loop Actions -->
            <div class="task-actions">
              @if (task.status === 'ready' || task.status === 'draft') {
                <button (click)="submitTaskForQC(task)" class="btn-action">
                  Submit for QC
                </button>
              }
              @if (task.status === 'in-qc') {
                <button (click)="failQC(task)" class="btn-danger">
                  Fail QC (Stub)
                </button>
              }
              @if (task.status === 'blocked' && task.blockedByIssueIds.length > 0) {
                <button (click)="resolveIssue(task)" class="btn-success">
                  Resolve Issue (Stub)
                </button>
                <span class="blocked-info">
                  Blocked by {{ task.blockedByIssueIds.length }} issue(s)
                </span>
              }
            </div>
          </div>
        }
      </div>

      <!-- Event Log -->
      <div class="event-log">
        <h3>📡 Event Log</h3>
        <div class="events-list">
          @for (event of eventLog(); track event.eventId) {
            <div class="event-item">
              <span class="event-type">{{ event.eventType }}</span>
              <span class="event-time">{{ formatTime(event.timestamp) }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tasks-module {
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

    .create-task-card, .tasks-list, .event-log {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      margin-top: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .input-field {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    textarea.input-field {
      min-height: 80px;
      resize: vertical;
    }

    .btn-primary, .btn-action, .btn-danger, .btn-success {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-primary {
      background: #1976d2;
      color: white;
    }

    .btn-action {
      background: #4caf50;
      color: white;
      margin-right: 0.5rem;
    }

    .btn-danger {
      background: #f44336;
      color: white;
      margin-right: 0.5rem;
    }

    .btn-success {
      background: #4caf50;
      color: white;
      margin-right: 0.5rem;
    }

    .task-card {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .task-card.blocked {
      border-color: #f44336;
      background: #fff3f3;
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
      font-weight: 500;
      background: #e0e0e0;
      color: #333;
    }

    .status-badge[data-status="ready"] {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-badge[data-status="in-qc"] {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-badge[data-status="blocked"] {
      background: #ffebee;
      color: #d32f2f;
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
      margin-bottom: 0.5rem;
    }

    .priority[data-priority="high"],
    .priority[data-priority="critical"] {
      color: #f44336;
      font-weight: 600;
    }

    .task-actions {
      display: flex;
      align-items: center;
      margin-top: 0.5rem;
    }

    .blocked-info {
      color: #f44336;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .empty-state {
      text-align: center;
      color: #999;
      padding: 2rem;
    }

    .event-log {
      max-height: 300px;
      overflow-y: auto;
    }

    .events-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .event-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      background: #f5f5f5;
      border-radius: 4px;
      font-size: 0.75rem;
    }

    .event-type {
      font-weight: 500;
      color: #1976d2;
    }

    .event-time {
      color: #999;
    }
  `]
})
export class TasksModule implements IAppModule, OnInit, OnDestroy {
  readonly id = 'tasks';
  readonly name = 'Tasks';
  readonly type: ModuleType = 'tasks';

  @Input() eventBus?: IModuleEventBus;

  // Local state (workspace-scoped)
  workspaceId = signal<string>('');
  tasks = signal<TaskEntity[]>([]);
  eventLog = signal<any[]>([]);

  // Form state
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskPriority: TaskPriority = 'medium';

  private readonly currentUserId = signal<string>('user-demo-001');
  private unsubscribers: Array<() => void> = [];

  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }

  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;
    this.workspaceId.set(eventBus.workspaceId);

    /**
     * Subscribe to events using EventBus interface
     * Returns cleanup functions that we store for proper cleanup
     * No manual .subscribe() - uses event bus abstraction
     */
    this.unsubscribers.push(
      eventBus.subscribe('TaskCreated', (event: any) => {
        console.log('[TasksModule] TaskCreated event received', event);
        this.addEventToLog(event);
      })
    );

    this.unsubscribers.push(
      eventBus.subscribe('QCFailed', (event: any) => {
        console.log('[TasksModule] QCFailed event received', event);
        this.addEventToLog(event);
      })
    );

    this.unsubscribers.push(
      eventBus.subscribe('IssueCreated', (event: any) => {
        console.log('[TasksModule] IssueCreated event received', event);
        this.addEventToLog(event);
      })
    );

    this.unsubscribers.push(
      eventBus.subscribe('IssueResolved', (event: any) => {
        console.log('[TasksModule] IssueResolved event received', event);
        this.addEventToLog(event);
      })
    );

    console.log('[TasksModule] Initialized with workspace:', this.workspaceId());
  }

  createNewTask(): void {
    if (!this.newTaskTitle.trim() || !this.eventBus) return;

    const task = createTask({
      workspaceId: this.workspaceId(),
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      createdById: this.currentUserId(),
      priority: this.newTaskPriority,
    });

    // Add to local state
    this.tasks.update(tasks => [...tasks, task]);

    // Publish event (append→publish→react pattern)
    const event = createTaskCreatedEvent(
      task.id,
      task.workspaceId,
      task.title,
      task.description,
      task.priority,
      task.createdById
    );

    this.eventBus.publish(event);
    this.addEventToLog(event);

    // Reset form
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPriority = 'medium';
  }

  submitTaskForQC(task: TaskEntity): void {
    if (!this.eventBus) return;

    // Update task status
    const updatedTask = updateTaskStatus(task, 'in-qc');
    this.updateTaskInList(updatedTask);

    // Publish event
    const event = createTaskSubmittedForQCEvent(
      task.id,
      this.workspaceId(),
      task.title,
      this.currentUserId()
    );

    this.eventBus.publish(event);
    this.addEventToLog(event);
  }

  failQC(task: TaskEntity): void {
    if (!this.eventBus) return;

    // Update task status to qc-failed
    const updatedTask = updateTaskStatus(task, 'qc-failed');
    this.updateTaskInList(updatedTask);

    // Publish QCFailed event
    const qcFailedEvent = createQCFailedEvent(
      task.id,
      this.workspaceId(),
      task.title,
      'Quality standards not met (stub)',
        this.currentUserId()
    );

    this.eventBus.publish(qcFailedEvent);
    this.addEventToLog(qcFailedEvent);

    // Create issue automatically (feedback loop)
    setTimeout(() => {
      const issueId = crypto.randomUUID();
      const issueEvent = createIssueCreatedEvent(
        issueId,
        task.id,
        this.workspaceId(),
        `QC Failed: ${task.title}`,
        'Quality standards not met (stub)',
        this.currentUserId(),
        qcFailedEvent.correlationId,
        qcFailedEvent.eventId
      );

      this.eventBus!.publish(issueEvent);
      this.addEventToLog(issueEvent);

      // Block the task
      const blockedTask = { ...updatedTask, status: 'blocked' as TaskStatus, blockedByIssueIds: [issueId] };
      this.updateTaskInList(blockedTask);
    }, 100);
  }

  resolveIssue(task: TaskEntity): void {
    if (!this.eventBus || task.blockedByIssueIds.length === 0) return;

    const issueId = task.blockedByIssueIds[0];
    if (!issueId) {
      return;
    }

    // Publish IssueResolved event
      const event = createIssueResolvedEvent(
        issueId,
        task.id,
        this.workspaceId(),
        this.currentUserId(),
        'Fixed (stub)'
      );

    this.eventBus.publish(event);
    this.addEventToLog(event);

    // Unblock task and set to ready
    const unblockedTask = {
      ...task,
      status: 'ready' as TaskStatus,
      blockedByIssueIds: [],
    };
    this.updateTaskInList(unblockedTask);
  }

  private updateTaskInList(updatedTask: TaskEntity): void {
    this.tasks.update(tasks =>
      tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    );
  }

  private addEventToLog(event: any): void {
    this.eventLog.update(log => [event, ...log].slice(0, 20)); // Keep last 20 events
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString();
  }

  activate(): void {
    console.log('[TasksModule] Activated');
  }

  deactivate(): void {
    console.log('[TasksModule] Deactivated');
  }

  destroy(): void {
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
    console.log('[TasksModule] Destroyed');
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
