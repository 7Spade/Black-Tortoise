/**
 * Daily Module - Work Log & Timesheet with Waterfall Layout
 * Layer: Presentation
 * Events: Publishes DailyEntryCreated
 * Layout: Waterfall/Masonry chronological display
 * 
 * Features:
 * - Quick entry form with man-day validation
 * - 7-day history view
 * - Copy previous day functionality
 * - Auto-populated active tasks
 * - Deferred loading for charts/statistics
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
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateDailyEntryHandler } from '@application/handlers/create-daily-entry.handler';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { DailyStore, DailyEntry } from '@application/stores/daily.store';
import { ModuleEventHelper } from '@presentation/components/module-event-helper';

@Component({
  selector: 'app-daily-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="daily-module">
      <div class="module-header">
        <h2>📅 Daily Log</h2>
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
          <span class="stat-value">{{ getTodayHeadcount().toFixed(2) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">This Month</span>
          <span class="stat-value">{{ getThisMonthHeadcount().toFixed(2) }}</span>
        </div>
      </div>

      <!-- Quick Entry Form -->
      <div class="daily-form">
        <h3>Log Work Entry</h3>
        
        <!-- Copy Previous Day Button -->
        <div class="form-actions">
          <button
            (click)="copyPreviousDay()"
            [disabled]="yesterdayEntries().length === 0"
            class="btn-secondary"
          >
            📋 Copy Yesterday
          </button>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Date</label>
            <input type="date" [(ngModel)]="entryDate" class="input-field" />
          </div>
          <div class="form-group">
            <label>Headcount (0.1-1.0)</label>
            <input
              type="number"
              [(ngModel)]="headcount"
              min="0.1"
              max="1.0"
              step="0.1"
              class="input-field"
            />
            <small>Remaining today: {{ getRemainingHeadcount().toFixed(2) }}</small>
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
          [disabled]="!canLogEntry()"
          class="btn-primary"
        >
          Log Entry
        </button>
        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }
      </div>

      <!-- 7-Day History -->
      <div class="history-section">
        <h3>Past 7 Days</h3>
        <div class="day-grid">
          @for (day of past7Days(); track day.date) {
            <div class="day-card">
              <div class="day-header">
                <span class="day-label">{{ day.label }}</span>
                <span class="day-total">{{ day.total.toFixed(2) }} man-days</span>
              </div>
              @if (day.entries.length > 0) {
                <ul class="day-entries">
                  @for (entry of day.entries; track entry.id) {
                    <li>
                      <span class="entry-headcount">{{ entry.headcount.toFixed(2) }}</span>
                      @if (entry.notes) {
                        <span class="entry-notes">{{ entry.notes }}</span>
                      }
                    </li>
                  }
                </ul>
              } @else {
                <p class="no-entries">No entries</p>
              }
            </div>
          }
        </div>
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
                  <span class="hours-value">{{ entry.headcount.toFixed(2) }}</span>
                  <span class="hours-label">man-day</span>
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
          } @else {
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
  headcount = 0.5;
  notes = '';
  errorMessage = signal<string | null>(null);
  private readonly currentUserId = 'user-demo';
  private subscriptions = ModuleEventHelper.createSubscriptionManager();

  sortedEntries = computed(() => {
    return [...this.dailyStore.entries()].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });

  /**
   * Get yesterday's entries for copying
   */
  yesterdayEntries = computed(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = this.toISODate(yesterday);
    
    return this.dailyStore.entries().filter(
      e => e.date === yesterdayStr && e.userId === this.currentUserId
    );
  });

  /**
   * Get past 7 days with entries grouped by date
   */
  past7Days = computed(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = this.toISODate(date);
      
      const dayEntries = this.dailyStore.entries().filter(
        e => e.date === dateStr && e.userId === this.currentUserId
      );
      
      const total = dayEntries.reduce((sum, e) => sum + e.headcount, 0);
      
      days.push({
        date: dateStr,
        label: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : this.formatDayLabel(date),
        entries: dayEntries,
        total,
      });
    }
    
    return days;
  });

  /**
   * Calculate remaining headcount for today
   */
  getRemainingHeadcount(): number {
    const todayTotal = this.getTodayHeadcount();
    return Math.max(0, 1.0 - todayTotal);
  }

  /**
   * Check if current entry can be logged
   */
  canLogEntry(): boolean {
    if (this.headcount <= 0 || this.headcount > 1.0) return false;
    const remaining = this.getRemainingHeadcount();
    return this.headcount <= remaining;
  }

  /**
   * Copy yesterday's entries to today
   */
  async copyPreviousDay(): Promise<void> {
    const yesterday = this.yesterdayEntries();
    if (yesterday.length === 0 || !this.eventBus) return;

    const today = this.getTodayDate();
    this.errorMessage.set(null);

    try {
      for (const entry of yesterday) {
        const entryId = crypto.randomUUID();
        await this.createDailyEntryHandler.execute({
          entryId,
          workspaceId: this.eventBus.workspaceId,
          date: today,
          userId: this.currentUserId,
          taskIds: entry.taskIds,
          headcount: entry.headcount,
          notes: entry.notes ? `[Copied] ${entry.notes}` : undefined,
        });
      }
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Failed to copy entries'
      );
    }
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0] ?? '';
  }

  private toISODate(date: Date): string {
    return date.toISOString().split('T')[0] ?? '';
  }

  private formatDayLabel(date: Date): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()] ?? '';
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
        this.errorMessage.set(null);
      }),
    );
  }

  async logEntry(): Promise<void> {
    if (!this.eventBus || !this.canLogEntry()) return;

    const entryId = crypto.randomUUID();
    this.errorMessage.set(null);

    const result = await this.createDailyEntryHandler.execute({
      entryId,
      workspaceId: this.eventBus.workspaceId,
      date: this.entryDate,
      userId: this.currentUserId,
      taskIds: [],
      headcount: this.headcount,
      ...(this.notes ? { notes: this.notes } : {}),
    });

    if (result.success) {
      this.headcount = 0.5;
      this.notes = '';
    } else {
      this.errorMessage.set(result.error ?? 'Failed to log entry');
    }
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
      .filter((e) => e.date === today && e.userId === this.currentUserId)
      .reduce((sum, e) => sum + e.headcount, 0);
  }

  getThisWeekHeadcount(): number {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return this.dailyStore
      .entries()
      .filter((e) => e.userId === this.currentUserId && new Date(e.date) >= weekStart)
      .reduce((sum, e) => sum + e.headcount, 0);
  }

  getThisMonthHeadcount(): number {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return this.dailyStore
      .entries()
      .filter((e) => e.userId === this.currentUserId && new Date(e.date) >= monthStart)
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
