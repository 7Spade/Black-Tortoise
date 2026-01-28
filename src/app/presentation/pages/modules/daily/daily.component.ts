/**
 * Daily Module - Work Log & Timesheet with Waterfall Layout
 * Layer: Presentation
 * Events: Publishes DailyEntryCreated
 * Layout: Waterfall/Masonry chronological display
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
import { CreateDailyEntryHandler } from '@application/handlers/create-daily-entry.handler';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { DailyStore } from '@daily/application/stores/daily.store';
import { ModuleEventHelper } from '@presentation/components/module-event-helper';

@Component({
  selector: 'app-daily-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="daily-module">
      <div class="module-header">
        <h2>?? Daily Log</h2>
        <p>Workspace: {{ eventBus?.workspaceId }}</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-label">Total Entries</span>
          <span class="stat-value">{{ dailyStore.entries().length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">This Week</span>
          <span class="stat-value">{{ getThisWeekHeadcount() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Today</span>
          <span class="stat-value">{{ getTodayHeadcount() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">This Month</span>
          <span class="stat-value">{{ getThisMonthHeadcount() }}</span>
        </div>
      </div>

      <!-- Quick Entry Form -->
      <div class="daily-form">
        <h3>Log Work Entry</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Date</label>
            <input type="date" [(ngModel)]="entryDate" class="input-field" />
          </div>
          <div class="form-group">
            <label>Headcount (manual)</label>
            <input
              type="number"
              [(ngModel)]="headcount"
              min="1"
              step="1"
              class="input-field"
            />
          </div>
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea
            [(ngModel)]="notes"
            class="input-field"
            placeholder="What did you work on?"
          ></textarea>
        </div>
        <button
          (click)="logEntry()"
          [disabled]="headcount <= 0"
          class="btn-primary"
        >
          Log Entry
        </button>
      </div>

      <!-- Waterfall Timeline -->
      <div class="timeline-section">
        <h3>Work Timeline</h3>
        <div class="waterfall-container">
          @for (entry of sortedEntries(); track entry.id) {
            <div
              class="waterfall-card"
              [style.animation-delay]="$index * 0.05 + 's'"
            >
              <div class="card-header">
                <div class="date-badge">
                  <div class="date-day">{{ getDayOfMonth(entry.date) }}</div>
                  <div class="date-month">{{ getMonthName(entry.date) }}</div>
                </div>
                <div class="hours-badge">
                  <span class="hours-value">{{ entry.headcount }}</span>
                  <span class="hours-label">people</span>
                </div>
              </div>
              @if (entry.notes) {
                <div class="card-body">
                  <p class="notes">{{ entry.notes }}</p>
                </div>
              }
              <div class="card-footer">
                <span class="timestamp">{{
                  getRelativeTime(entry.createdAt)
                }}</span>
                @if (entry.taskIds.length > 0) {
                  <span class="task-count"
                    >{{ entry.taskIds.length }} task(s)</span
                  >
                }
              </div>
            </div>
          }
          @if (dailyStore.entries().length === 0) {
            <div class="empty-state">
              <p>No entries yet. Start logging your work!</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./daily.component.scss'],
})
export class DailyComponent implements IAppModule, OnInit, OnDestroy {
  readonly id = 'daily';
  readonly name = 'Daily';
  readonly type: ModuleType = 'daily';

  @Input() eventBus: IModuleEventBus | undefined;
  readonly dailyStore = inject(DailyStore);
  private readonly createDailyEntryHandler = inject(CreateDailyEntryHandler);

  entryDate: string = this.getTodayDate();
  headcount = 0;
  notes = '';
  private readonly currentUserId = 'user-demo';
  private subscriptions = ModuleEventHelper.createSubscriptionManager();

  sortedEntries = computed(() => {
    return [...this.dailyStore.entries()].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0] ?? '';
  }

  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }

  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;

    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.dailyStore.clearEntries();
      }),
    );
  }

  async logEntry(): Promise<void> {
    if (!this.eventBus || this.headcount <= 0) return;

    const entryId = crypto.randomUUID();

    const request: Parameters<typeof this.createDailyEntryHandler.execute>[0] =
      {
        entryId,
        workspaceId: this.eventBus.workspaceId,
        date: this.entryDate,
        userId: this.currentUserId,
        taskIds: [],
        headcount: this.headcount,
        ...(this.notes ? { notes: this.notes } : {}),
      };

    await this.createDailyEntryHandler.execute(request);

    this.headcount = 0;
    this.notes = '';
  }

  getDayOfMonth(dateStr: string): string {
    return new Date(dateStr).getDate().toString();
  }

  getMonthName(dateStr: string): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[new Date(dateStr).getMonth()] ?? 'Jan';
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  }

  getTodayHeadcount(): number {
    const today = this.getTodayDate();
    return this.dailyStore
      .entries()
      .filter((e) => e.date === today)
      .reduce((sum, e) => sum + e.headcount, 0);
  }

  getThisWeekHeadcount(): number {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return this.dailyStore
      .entries()
      .filter((e) => new Date(e.date) >= weekStart)
      .reduce((sum, e) => sum + e.headcount, 0);
  }

  getThisMonthHeadcount(): number {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return this.dailyStore
      .entries()
      .filter((e) => new Date(e.date) >= monthStart)
      .reduce((sum, e) => sum + e.headcount, 0);
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
