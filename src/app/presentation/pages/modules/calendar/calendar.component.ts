/**
 * Calendar Module - Calendar Grid View with Task Events
 * Layer: Presentation
 * Architecture: Signal-based, Event-driven, Responsive Grid
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
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { TasksStore } from '@application/stores/tasks.store';
import { ModuleEventHelper } from '@presentation/components/module-event-helper';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Array<{ id: string; title: string; status: string }>;
}

@Component({
  selector: 'app-calendar-module',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="calendar-module">
      <div class="module-header">
        <h2>📅 Calendar</h2>
        <p>Workspace: {{ eventBus?.workspaceId }}</p>
      </div>

      <div class="calendar-controls">
        <button (click)="previousMonth()" class="nav-btn">‹</button>
        <h3>{{ currentMonthName() }} {{ currentYear() }}</h3>
        <button (click)="nextMonth()" class="nav-btn">›</button>
      </div>

      <div class="calendar-grid">
        <div class="calendar-header">
          @for (day of weekDays; track day) {
            <div class="day-name">{{ day }}</div>
          }
        </div>

        <div class="calendar-body">
          @for (week of calendarWeeks(); track $index) {
            <div class="calendar-week">
              @for (day of week; track day.date) {
                <div
                  class="calendar-day"
                  [class.other-month]="!day.isCurrentMonth"
                  [class.today]="day.isToday"
                  (click)="selectDay(day)"
                >
                  <div class="day-number">{{ day.date }}</div>
                  @if (day.tasks.length > 0) {
                    <div class="task-indicators">
                      @for (task of day.tasks.slice(0, 3); track task.id) {
                        <div
                          class="task-dot"
                          [attr.data-status]="task.status"
                        ></div>
                      }
                      @if (day.tasks.length > 3) {
                        <span class="more-tasks"
                          >+{{ day.tasks.length - 3 }}</span
                        >
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>

      @if (selectedDay()) {
        <div class="day-detail">
          <h4>Tasks for {{ selectedDay()?.date }}</h4>
          @if (selectedDay()!.tasks.length === 0) {
            <p class="no-tasks">No tasks scheduled</p>
          } @else {
            @for (task of selectedDay()!.tasks; track task.id) {
              <div class="task-item" [attr.data-status]="task.status">
                <span class="task-title">{{ task.title }}</span>
                <span class="task-status">{{ task.status }}</span>
              </div>
            }
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .calendar-module {
        padding: 1.5rem;
        max-width: 1200px;
      }
      .module-header h2 {
        margin: 0 0 0.5rem 0;
        color: var(--md-sys-color-primary);
      }

      .calendar-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background: var(--md-sys-color-surface);
        border-radius: 8px;
        margin: 1rem 0;
      }

      .calendar-controls h3 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--md-sys-color-on-surface);
      }

      .nav-btn {
        width: 40px;
        height: 40px;
        border: 1px solid var(--md-sys-color-outline-variant);
        background: var(--md-sys-color-surface);
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.5rem;
        transition: all 0.2s;
      }

      .nav-btn:hover {
        background: var(--md-sys-color-surface-container);
      }

      .calendar-grid {
        background: var(--md-sys-color-surface);
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: 8px;
        overflow: hidden;
      }

      .calendar-header {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        background: var(--md-sys-color-surface-container);
        border-bottom: 1px solid var(--md-sys-color-outline-variant);
      }

      .day-name {
        padding: 1rem;
        text-align: center;
        font-weight: 600;
        font-size: 0.875rem;
        color: var(--md-sys-color-on-surface-variant);
      }

      .calendar-body {
        display: flex;
        flex-direction: column;
      }

      .calendar-week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
      }

      .calendar-day {
        aspect-ratio: 1;
        padding: 0.5rem;
        border: 1px solid var(--md-sys-color-outline-variant);
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        flex-direction: column;
      }

      .calendar-day:hover {
        background: var(--md-sys-color-surface-container-high);
      }

      .calendar-day.today {
        background: var(--md-sys-color-primary-container);
      }

      .calendar-day.other-month {
        opacity: 0.3;
      }

      .day-number {
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
        margin-bottom: 0.25rem;
      }

      .task-indicators {
        display: flex;
        gap: 2px;
        flex-wrap: wrap;
        margin-top: auto;
      }

      .task-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--md-sys-color-primary);
      }

      .task-dot[data-status='completed'] {
        background: var(--md-sys-color-tertiary);
      }

      .task-dot[data-status='blocked'] {
        background: var(--md-sys-color-error);
      }

      .task-dot[data-status='in-qc'] {
        background: var(--md-sys-color-secondary);
      }

      .more-tasks {
        font-size: 0.625rem;
        color: var(--md-sys-color-on-surface-variant);
        margin-left: 2px;
      }

      .day-detail {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--md-sys-color-surface);
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: 8px;
      }

      .day-detail h4 {
        margin: 0 0 1rem 0;
        color: var(--md-sys-color-on-surface);
      }

      .no-tasks {
        color: var(--md-sys-color-on-surface-variant);
        text-align: center;
        padding: 1rem;
      }

      .task-item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem;
        margin-bottom: 0.5rem;
        background: var(--md-sys-color-surface-container);
        border-radius: 4px;
        border-left: 3px solid var(--md-sys-color-primary);
      }

      .task-item[data-status='completed'] {
        border-left-color: var(--md-sys-color-tertiary);
      }

      .task-item[data-status='blocked'] {
        border-left-color: var(--md-sys-color-error);
      }

      .task-status {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        background: var(--md-sys-color-surface);
        border-radius: 12px;
        color: var(--md-sys-color-on-surface-variant);
      }

      /* Responsive */
      @media (max-width: 768px) {
        .day-name {
          padding: 0.5rem;
          font-size: 0.75rem;
        }

        .calendar-day {
          padding: 0.25rem;
        }

        .day-number {
          font-size: 0.75rem;
        }
      }
    `,
  ],
})
export class CalendarComponent implements IAppModule, OnInit, OnDestroy {
  readonly id = 'calendar';
  readonly name = 'Calendar';
  readonly type: ModuleType = 'calendar';

  @Input() eventBus: IModuleEventBus | undefined;
  readonly tasksStore = inject(TasksStore);

  readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());
  selectedDay = signal<CalendarDay | null>(null);

  currentMonthName = computed(() => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[this.currentMonth()];
  });

  calendarWeeks = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const today = new Date();
    const isCurrentMonth =
      today.getMonth() === month && today.getFullYear() === year;
    const todayDate = today.getDate();

    const weeks: CalendarDay[][] = [];
    let currentWeek: CalendarDay[] = [];

    // Fill previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      currentWeek.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        tasks: [],
      });
    }

    // Fill current month days
    for (let date = 1; date <= daysInMonth; date++) {
      currentWeek.push({
        date,
        isCurrentMonth: true,
        isToday: isCurrentMonth && date === todayDate,
        tasks: this.getTasksForDate(year, month, date),
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill next month days
    if (currentWeek.length > 0) {
      const remainingDays = 7 - currentWeek.length;
      for (let i = 1; i <= remainingDays; i++) {
        currentWeek.push({
          date: i,
          isCurrentMonth: false,
          isToday: false,
          tasks: [],
        });
      }
      weeks.push(currentWeek);
    }

    return weeks;
  });

  private subscriptions = ModuleEventHelper.createSubscriptionManager();

  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }

  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;

    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.selectedDay.set(null);
      }),
    );

    // React to task events
    this.subscriptions.add(
      eventBus.subscribe('TaskCreated', () => {
        // Calendar will auto-update via computed signal
      }),
    );
  }

  previousMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.update((y) => y - 1);
    } else {
      this.currentMonth.update((m) => m - 1);
    }
  }

  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.update((y) => y + 1);
    } else {
      this.currentMonth.update((m) => m + 1);
    }
  }

  selectDay(day: CalendarDay): void {
    if (!day.isCurrentMonth) return;
    this.selectedDay.set(day);
  }

  private getTasksForDate(
    year: number,
    month: number,
    date: number,
  ): Array<{ id: string; title: string; status: string }> {
    // For demo: randomly assign some tasks to dates
    const tasks = this.tasksStore.tasks();
    const dayIndex = date % tasks.length;

    if (date % 3 === 0 && tasks[dayIndex]) {
      return [
        {
          id: tasks[dayIndex].id,
          title: tasks[dayIndex].title,
          status: tasks[dayIndex].status,
        },
      ];
    }

    return [];
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
