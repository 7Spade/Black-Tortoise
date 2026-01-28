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
import { TasksStore } from '@tasks/application/stores/tasks.store';
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
        <h2>?? Calendar</h2>
        <p>Workspace: {{ eventBus?.workspaceId }}</p>
      </div>

      <div class="calendar-controls">
        <button (click)="previousMonth()" class="nav-btn">??/button>
        <h3>{{ currentMonthName() }} {{ currentYear() }}</h3>
        <button (click)="nextMonth()" class="nav-btn">??/button>
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
  styleUrls: ['./calendar.component.scss'],
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
