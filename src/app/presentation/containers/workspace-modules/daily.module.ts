/**
 * Daily Module - Work Log & Timesheet with Waterfall Layout
 * Layer: Presentation
 * Events: Publishes DailyEntryCreated
 * Layout: Waterfall/Masonry chronological display
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { DailyStore } from '@application/daily/stores/daily.store';
import { CreateDailyEntryUseCase } from '@application/daily/use-cases/create-daily-entry.use-case';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';

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
          <span class="stat-value">{{ getThisWeekHours() }}h</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Today</span>
          <span class="stat-value">{{ getTodayHours() }}h</span>
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
            <label>Hours Logged</label>
            <input type="number" [(ngModel)]="hoursLogged" min="0" max="24" step="0.5" class="input-field" />
          </div>
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea [(ngModel)]="notes" class="input-field" placeholder="What did you work on?"></textarea>
        </div>
        <button (click)="logEntry()" [disabled]="hoursLogged <= 0" class="btn-primary">Log Entry</button>
      </div>

      <!-- Waterfall Timeline -->
      <div class="timeline-section">
        <h3>Work Timeline</h3>
        <div class="waterfall-container">
          @for (entry of sortedEntries(); track entry.id) {
            <div class="waterfall-card" [style.animation-delay]="$index * 0.05 + 's'">
              <div class="card-header">
                <div class="date-badge">
                  <div class="date-day">{{ getDayOfMonth(entry.date) }}</div>
                  <div class="date-month">{{ getMonthName(entry.date) }}</div>
                </div>
                <div class="hours-badge">
                  <span class="hours-value">{{ entry.hoursLogged }}</span>
                  <span class="hours-label">hours</span>
                </div>
              </div>
              @if (entry.notes) {
                <div class="card-body">
                  <p class="notes">{{ entry.notes }}</p>
                </div>
              }
              <div class="card-footer">
                <span class="timestamp">{{ getRelativeTime(entry.createdAt) }}</span>
                @if (entry.taskIds.length > 0) {
                  <span class="task-count">{{ entry.taskIds.length }} task(s)</span>
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
  styles: [`
    .daily-module { 
      padding: 1.5rem; 
      max-width: 1200px;
    }
    
    .module-header h2 { 
      margin: 0 0 0.5rem 0; 
      color: #1976d2; 
    }
    
    .stats-bar {
      display: flex;
      gap: 1rem;
      margin: 1rem 0;
    }
    
    .stat-item {
      flex: 1;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .stat-label {
      font-size: 0.75rem;
      color: #666;
      margin-bottom: 0.5rem;
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1976d2;
    }
    
    .daily-form { 
      background: white; 
      border: 1px solid #e0e0e0; 
      border-radius: 8px; 
      padding: 1.5rem; 
      margin: 1rem 0;
    }
    
    .daily-form h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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
      font-family: inherit;
    }
    
    .btn-primary { 
      padding: 0.75rem 1.5rem; 
      border: none; 
      border-radius: 4px; 
      background: #1976d2; 
      color: white; 
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #1565c0;
    }
    
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .timeline-section {
      margin-top: 2rem;
    }
    
    .timeline-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }
    
    .waterfall-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      align-items: start;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .waterfall-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      animation: slideUp 0.3s ease-out forwards;
    }
    
    .waterfall-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
      color: white;
    }
    
    .date-badge {
      text-align: center;
    }
    
    .date-day {
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1;
    }
    
    .date-month {
      font-size: 0.75rem;
      text-transform: uppercase;
      opacity: 0.9;
    }
    
    .hours-badge {
      text-align: right;
    }
    
    .hours-value {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1;
      display: block;
    }
    
    .hours-label {
      font-size: 0.75rem;
      opacity: 0.9;
    }
    
    .card-body {
      padding: 1rem;
    }
    
    .notes {
      margin: 0;
      color: #333;
      line-height: 1.5;
      font-size: 0.875rem;
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: #f5f5f5;
      border-top: 1px solid #e0e0e0;
      font-size: 0.75rem;
      color: #666;
    }
    
    .task-count {
      color: #1976d2;
      font-weight: 600;
    }
    
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: #999;
    }
    
    @media (max-width: 768px) {
      .stats-bar {
        flex-direction: column;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .waterfall-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DailyModule implements IAppModule, OnInit, OnDestroy {
  readonly id = 'daily';
  readonly name = 'Daily';
  readonly type: ModuleType = 'daily';
  
  @Input() eventBus?: IModuleEventBus;
  readonly dailyStore = inject(DailyStore);
  private readonly createDailyEntryUseCase = inject(CreateDailyEntryUseCase);
  
  entryDate: string = this.getTodayDate();
  hoursLogged = 0;
  notes = '';
  private readonly currentUserId = 'user-demo';
  private subscriptions = ModuleEventHelper.createSubscriptionManager();
  
  sortedEntries = computed(() => {
    return [...this.dailyStore.entries()].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
      })
    );
    
  }
  
  async logEntry(): Promise<void> {
    if (!this.eventBus || this.hoursLogged <= 0) return;
    
    const entryId = crypto.randomUUID();
    
    const request: Parameters<typeof this.createDailyEntryUseCase.execute>[0] = {
      entryId,
      workspaceId: this.eventBus.workspaceId,
      date: this.entryDate,
      userId: this.currentUserId,
      taskIds: [],
      hoursLogged: this.hoursLogged,
      ...(this.notes ? { notes: this.notes } : {}),
    };
    
    await this.createDailyEntryUseCase.execute(request);
    
    this.hoursLogged = 0;
    this.notes = '';
  }
  
  getDayOfMonth(dateStr: string): string {
    return new Date(dateStr).getDate().toString();
  }
  
  getMonthName(dateStr: string): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
  
  getTodayHours(): number {
    const today = this.getTodayDate();
    return this.dailyStore.entries()
      .filter(e => e.date === today)
      .reduce((sum, e) => sum + e.hoursLogged, 0);
  }
  
  getThisWeekHours(): number {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    return this.dailyStore.entries()
      .filter(e => new Date(e.date) >= weekStart)
      .reduce((sum, e) => sum + e.hoursLogged, 0);
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
