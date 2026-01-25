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
 * - No direct eventBus.publish or eventStore.append calls
 * - Only dispatches commands to use cases
 * - Subscribes to events for view-model projection only
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { TasksStore, TaskEntity, TaskPriority, TaskStatus, createTask } from '@application/tasks';
import { CreateTaskUseCase, SubmitTaskForQCUseCase } from '@application/tasks';
import { FailQCUseCase } from '@application/quality-control/use-cases/fail-qc.use-case';
import { ResolveIssueUseCase } from '@application/issues/use-cases/resolve-issue.use-case';

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

      <!-- View Selector -->
      <div class="view-selector">
        <button 
          (click)="viewMode.set('list')" 
          [class.active]="viewMode() === 'list'"
          class="view-btn">
          List
        </button>
        <button 
          (click)="viewMode.set('kanban')" 
          [class.active]="viewMode() === 'kanban'"
          class="view-btn">
          Kanban
        </button>
        <button 
          (click)="viewMode.set('gantt')" 
          [class.active]="viewMode() === 'gantt'"
          class="view-btn">
          Gantt
        </button>
      </div>

      <!-- Tasks List View -->
      @if (viewMode() === 'list') {
        <div class="tasks-list">
          <h3>Tasks ({{ tasksStore.tasks().length }})</h3>
          @if (tasksStore.tasks().length === 0) {
            <div class="empty-state">No tasks yet. Create one above!</div>
          }
          @for (task of tasksStore.tasks(); track task.id) {
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
      }

      <!-- Kanban View -->
      @if (viewMode() === 'kanban') {
        <div class="kanban-view">
          <div class="kanban-columns">
            @for (status of kanbanStatuses; track status) {
              <div class="kanban-column">
                <div class="column-header">
                  <h4>{{ status }}</h4>
                  <span class="count">{{ getTasksByStatus(status).length }}</span>
                </div>
                <div class="column-cards">
                  @for (task of getTasksByStatus(status); track task.id) {
                    <div class="kanban-card" [class.blocked]="task.status === 'blocked'">
                      <h5>{{ task.title }}</h5>
                      <p>{{ task.description }}</p>
                      <span class="priority-tag" [attr.data-priority]="task.priority">
                        {{ task.priority }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Gantt View -->
      @if (viewMode() === 'gantt') {
        <div class="gantt-view">
          <div class="gantt-header">
            <div class="gantt-task-col">Task</div>
            <div class="gantt-timeline">
              @for (day of ganttDays; track day) {
                <div class="gantt-day">{{ day }}</div>
              }
            </div>
          </div>
          @for (task of tasksStore.tasks(); track task.id) {
            <div class="gantt-row">
              <div class="gantt-task-col">
                <strong>{{ task.title }}</strong>
                <span class="gantt-status" [attr.data-status]="task.status">{{ task.status }}</span>
              </div>
              <div class="gantt-timeline">
                <div class="gantt-bar" [style.width.%]="getTaskProgress(task)"></div>
              </div>
            </div>
          }
        </div>
      }

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

    /* View Selector */
    .view-selector {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .view-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .view-btn.active {
      background: #1976d2;
      color: white;
      border-color: #1976d2;
    }

    /* Kanban View */
    .kanban-view {
      overflow-x: auto;
    }

    .kanban-columns {
      display: flex;
      gap: 1rem;
      min-width: fit-content;
    }

    .kanban-column {
      flex: 0 0 280px;
      background: #fafafa;
      border-radius: 8px;
      padding: 1rem;
    }

    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .column-header h4 {
      margin: 0;
      font-size: 0.875rem;
      text-transform: uppercase;
      color: #666;
    }

    .count {
      background: #1976d2;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .column-cards {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .kanban-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 1rem;
      cursor: grab;
    }

    .kanban-card h5 {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      color: #333;
    }

    .kanban-card p {
      margin: 0 0 0.5rem 0;
      font-size: 0.75rem;
      color: #666;
      line-height: 1.4;
    }

    .priority-tag {
      display: inline-block;
      padding: 0.125rem 0.5rem;
      font-size: 0.625rem;
      font-weight: 600;
      border-radius: 8px;
      background: #e0e0e0;
      color: #333;
    }

    .priority-tag[data-priority="high"],
    .priority-tag[data-priority="critical"] {
      background: #ffebee;
      color: #d32f2f;
    }

    /* Gantt View */
    .gantt-view {
      overflow-x: auto;
    }

    .gantt-header {
      display: flex;
      border-bottom: 2px solid #e0e0e0;
      margin-bottom: 0.5rem;
      padding-bottom: 0.5rem;
    }

    .gantt-task-col {
      flex: 0 0 200px;
      font-weight: 600;
      padding: 0.5rem;
    }

    .gantt-timeline {
      flex: 1;
      display: flex;
      position: relative;
    }

    .gantt-day {
      flex: 1;
      text-align: center;
      font-size: 0.75rem;
      color: #666;
      padding: 0.25rem;
    }

    .gantt-row {
      display: flex;
      border-bottom: 1px solid #f0f0f0;
      min-height: 48px;
      align-items: center;
    }

    .gantt-row .gantt-task-col {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .gantt-status {
      font-size: 0.625rem;
      padding: 0.125rem 0.375rem;
      background: #e0e0e0;
      border-radius: 8px;
      display: inline-block;
    }

    .gantt-bar {
      height: 24px;
      background: linear-gradient(90deg, #1976d2, #42a5f5);
      border-radius: 4px;
      margin: 0.5rem;
      transition: width 0.3s;
    }
  `]
})
export class TasksModule implements IAppModule, OnInit, OnDestroy {
  readonly id = 'tasks';
  readonly name = 'Tasks';
  readonly type: ModuleType = 'tasks';

  @Input() eventBus?: IModuleEventBus;

  readonly tasksStore = inject(TasksStore);
  private readonly createTaskUseCase = inject(CreateTaskUseCase);
  private readonly submitTaskForQCUseCase = inject(SubmitTaskForQCUseCase);
  private readonly failQCUseCase = inject(FailQCUseCase);
  private readonly resolveIssueUseCase = inject(ResolveIssueUseCase);

  workspaceId = signal<string>('');
  eventLog = signal<any[]>([]);
  viewMode = signal<'list' | 'kanban' | 'gantt'>('list');

  newTaskTitle = '';
  newTaskDescription = '';
  newTaskPriority: TaskPriority = TaskPriority.MEDIUM;

  readonly kanbanStatuses = ['draft', 'ready', 'in-qc', 'qc-failed', 'blocked', 'completed'];
  readonly ganttDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

    this.unsubscribers.push(
      eventBus.subscribe('WorkspaceSwitched', () => {
        this.tasksStore.clearTasks();
        this.eventLog.set([]);
      })
    );

    console.log('[TasksModule] Initialized with workspace:', this.workspaceId());
  }

  async createNewTask(): Promise<void> {
    if (!this.newTaskTitle.trim() || !this.eventBus) return;

    const task = createTask({
      workspaceId: this.workspaceId(),
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      createdById: this.currentUserId(),
      priority: this.newTaskPriority,
    });

    const result = await this.createTaskUseCase.execute({
      taskId: task.id,
      workspaceId: task.workspaceId,
      title: task.title,
      description: task.description,
      priority: task.priority,
      createdById: task.createdById,
    });

    if (result.success) {
      this.newTaskTitle = '';
      this.newTaskDescription = '';
      this.newTaskPriority = TaskPriority.MEDIUM;
    }
  }

  async submitTaskForQC(task: TaskEntity): Promise<void> {
    if (!this.eventBus) return;

    await this.submitTaskForQCUseCase.execute({
      taskId: task.id,
      workspaceId: this.workspaceId(),
      taskTitle: task.title,
      submittedBy: this.currentUserId(),
    });
  }

  /**
   * Fail QC for a task
   * 
   * Constitution Compliance:
   * - Presentation only dispatches command to use case
   * - Use case publishes QCFailed event via PublishEventUseCase
   * - QC event handler creates derived IssueCreated event with causality
   * - No direct issue creation in presentation layer
   */
  async failQC(task: TaskEntity): Promise<void> {
    if (!this.eventBus) return;

    const failureReason = 'Quality standards not met (stub)';
    await this.failQCUseCase.execute({
      taskId: task.id,
      workspaceId: this.workspaceId(),
      taskTitle: task.title,
      failureReason,
      reviewedBy: this.currentUserId(),
    });
    
    // Issue creation is now handled by QC event handler
    // with proper causality (correlationId inherited, causationId = QCFailed.eventId)
  }

  async resolveIssue(task: TaskEntity): Promise<void> {
    if (!this.eventBus || task.blockedByIssueIds.length === 0) return;

    const issueId = task.blockedByIssueIds[0];
    if (!issueId) {
      return;
    }

    await this.resolveIssueUseCase.execute({
      issueId,
      taskId: task.id,
      workspaceId: this.workspaceId(),
      resolvedBy: this.currentUserId(),
      resolution: 'Fixed (stub)',
    });
  }

  private addEventToLog(event: any): void {
    this.eventLog.update(log => [event, ...log].slice(0, 20)); // Keep last 20 events
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString();
  }

  getTasksByStatus(status: string): TaskEntity[] {
    return this.tasksStore.tasks().filter(t => t.status === status);
  }

  getTaskProgress(task: TaskEntity): number {
    const statusProgress: Record<string, number> = {
      'draft': 10,
      'ready': 25,
      'in-qc': 50,
      'qc-failed': 40,
      'blocked': 30,
      'completed': 100,
    };
    return statusProgress[task.status] || 0;
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
