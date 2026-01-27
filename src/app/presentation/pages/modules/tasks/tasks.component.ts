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
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TasksFacade } from '@application/facades/tasks.facade';
import { TasksStore } from '@application/stores/tasks.store';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { TaskAggregate, TaskPriority } from '@domain/aggregates/task.aggregate';

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
          (click)="tasksStore.setViewMode('list')"
          [class.active]="viewMode() === 'list'"
          class="view-btn"
        >
          List
        </button>
        <button
          (click)="tasksStore.setViewMode('kanban')"
          [class.active]="viewMode() === 'kanban'"
          class="view-btn"
        >
          Kanban
        </button>
        <button
          (click)="tasksStore.setViewMode('gantt')"
          [class.active]="viewMode() === 'gantt'"
          class="view-btn"
        >
          Gantt
        </button>
      </div>

      <!-- Tasks List View -->
      @if (viewMode() === 'list') {
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
                @if (
                  task.status === 'blocked' && task.blockedByIssueIds.length > 0
                ) {
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
        @defer (on viewport) {
          <div class="kanban-view">
            <div class="kanban-columns">
              @for (status of kanbanStatuses; track status) {
                <div class="kanban-column">
                  <div class="column-header">
                    <h4>{{ status }}</h4>
                    <span class="count">{{
                      getTasksByStatus(status).length
                    }}</span>
                  </div>
                  <div class="column-cards">
                    @for (task of getTasksByStatus(status); track task.id) {
                      <div
                        class="kanban-card"
                        [class.blocked]="task.status === 'blocked'"
                      >
                        <h5>{{ task.title }}</h5>
                        <p>{{ task.description }}</p>
                        <span
                          class="priority-tag"
                          [attr.data-priority]="task.priority"
                        >
                          {{ task.priority }}
                        </span>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        } @placeholder {
          <div class="loading-placeholder">Loading Kanban view...</div>
        }
      }

      <!-- Gantt View -->
      @if (viewMode() === 'gantt') {
        @defer (on viewport) {
          <div class="gantt-view">
            <div class="gantt-header">
              <div class="gantt-task-col">Task</div>
              <div class="gantt-timeline">
                @for (day of ganttDays; track day) {
                  <div class="gantt-day">{{ day }}</div>
                }
              </div>
            </div>
            @for (task of tasks(); track task.id) {
              <div class="gantt-row">
                <div class="gantt-task-col">
                  <strong>{{ task.title }}</strong>
                  <span class="gantt-status" [attr.data-status]="task.status">{{
                    task.status
                  }}</span>
                </div>
                <div class="gantt-timeline">
                  <div
                    class="gantt-bar"
                    [style.width.%]="getTaskProgress(task)"
                  ></div>
                </div>
              </div>
            }
          </div>
        } @placeholder {
          <div class="loading-placeholder">Loading Gantt view...</div>
        }
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
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements IAppModule, OnInit, OnDestroy {
  readonly id = 'tasks';
  readonly name = 'Tasks';
  readonly type: ModuleType = 'tasks';

  @Input() eventBus: IModuleEventBus | undefined;

  // Facade Pattern Injection
  private readonly tasksFacade = inject(TasksFacade);
  private readonly tasksStore = inject(TasksStore);

  // Facade Signals Aliases
  workspaceId = this.tasksFacade.workspaceId;
  eventLog = this.tasksFacade.eventLog;
  tasks = this.tasksStore.taskList; // Use taskList computed from Map
  viewMode = this.tasksStore.viewMode; // Use store's viewMode signal

  newTaskTitle = '';
  newTaskDescription = '';
  newTaskPriority: TaskPriority = TaskPriority.MEDIUM;

  readonly kanbanStatuses = [
    'draft',
    'ready',
    'in-qc',
    'qc-failed',
    'blocked',
    'completed',
  ];
  readonly ganttDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }

  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;
    this.tasksFacade.initialize(eventBus);
  }

  async createNewTask(): Promise<void> {
    if (!this.newTaskTitle.trim()) return;

    const success = await this.tasksFacade.createTask(
      this.newTaskTitle,
      this.newTaskDescription,
      this.newTaskPriority,
    );

    if (success) {
      this.newTaskTitle = '';
      this.newTaskDescription = '';
      this.newTaskPriority = TaskPriority.MEDIUM;
    }
  }

  async submitTaskForQC(task: TaskAggregate): Promise<void> {
    await this.tasksFacade.submitForQC(task);
  }

  async failQC(task: TaskAggregate): Promise<void> {
    const reason = 'Failed manual check (stub)';
    await this.tasksFacade.failQC(task, reason);
  }

  async resolveIssue(task: TaskAggregate): Promise<void> {
    const issueId =
      (task.blockedByIssueIds && task.blockedByIssueIds[0]) || 'stub-issue-id';
    const resolution = 'Resolved via UI stub';
    await this.tasksFacade.resolveIssue(task, issueId, resolution);
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString();
  }

  getTasksByStatus(status: string): TaskAggregate[] {
    return this.tasks().filter((t) => t.status === status);
  }

  getTaskProgress(task: TaskAggregate): number {
    const statusProgress: Record<string, number> = {
      draft: 10,
      ready: 25,
      'in-qc': 50,
      'qc-failed': 40,
      blocked: 30,
      completed: 100,
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
    console.log('[TasksModule] Destroyed');
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
