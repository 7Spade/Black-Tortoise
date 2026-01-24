/**
 * Daily Module - Work Log & Timesheet
 * Layer: Presentation
 * Events: Publishes DailyEntryCreated
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { DailyStore } from '@application/daily/stores/daily.store';
import { createDailyEntryCreatedEvent } from '@domain/events/domain-events';
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
      
      <div class="daily-form">
        <h3>Log Work Entry</h3>
        <div class="form-group">
          <label>Date</label>
          <input type="date" [(ngModel)]="entryDate" class="input-field" />
        </div>
        <div class="form-group">
          <label>Hours Logged</label>
          <input type="number" [(ngModel)]="hoursLogged" min="0" max="24" step="0.5" class="input-field" />
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea [(ngModel)]="notes" class="input-field"></textarea>
        </div>
        <button (click)="logEntry()" class="btn-primary">Log Entry</button>
      </div>

      <div class="entries-section">
        <h3>Recent Entries ({{ dailyStore.entries().length }})</h3>
        @for (entry of dailyStore.entries(); track entry.id) {
          <div class="entry-card">
            <div class="entry-header">
              <h4>{{ entry.date }}</h4>
              <span class="hours">{{ entry.hoursLogged }}h</span>
            </div>
            @if (entry.notes) {
              <p>{{ entry.notes }}</p>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .daily-module { padding: 1.5rem; max-width: 800px; }
    .module-header h2 { margin: 0 0 0.5rem 0; color: #1976d2; }
    .daily-form, .entries-section { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .input-field { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    textarea.input-field { min-height: 80px; resize: vertical; }
    .btn-primary { padding: 0.5rem 1rem; border: none; border-radius: 4px; background: #1976d2; color: white; cursor: pointer; }
    .entry-card { border: 1px solid #e0e0e0; border-radius: 4px; padding: 1rem; margin-bottom: 0.5rem; }
    .entry-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    .hours { font-weight: bold; color: #1976d2; }
  `]
})
export class DailyModule implements IAppModule, OnInit, OnDestroy {
  readonly id = 'daily';
  readonly name = 'Daily';
  readonly type: ModuleType = 'daily';
  
  @Input() eventBus?: IModuleEventBus;
  readonly dailyStore = inject(DailyStore);
  
  entryDate = new Date().toISOString().split('T')[0];
  hoursLogged = 0;
  notes = '';
  private readonly currentUserId = 'user-demo';
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
        this.dailyStore.clearEntries();
      })
    );
    
    ModuleEventHelper.publishModuleInitialized(eventBus, this.id);
  }
  
  logEntry(): void {
    if (!this.eventBus || this.hoursLogged <= 0) return;
    
    const entry = {
      date: this.entryDate,
      userId: this.currentUserId,
      taskIds: [],
      hoursLogged: this.hoursLogged,
      notes: this.notes || undefined,
    };
    
    this.dailyStore.createEntry(entry);
    
    const newEntry = this.dailyStore.entries()[this.dailyStore.entries().length - 1];
    if (newEntry) {
      const event = createDailyEntryCreatedEvent(
        newEntry.id,
        this.eventBus.workspaceId,
        newEntry.date,
        newEntry.userId,
        newEntry.taskIds,
        newEntry.hoursLogged,
        newEntry.notes
      );
      this.eventBus.publish(event);
    }
    
    this.hoursLogged = 0;
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
