/**
 * Calendar Module - Calendar View of Tasks & Events
 * Layer: Presentation
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';

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
      
      <div class="calendar-view">
        <h3>Calendar View</h3>
        <p>Calendar visualization will be implemented here</p>
      </div>
    </div>
  `,
  styles: [`
    .calendar-module { padding: 1.5rem; max-width: 1200px; }
    .module-header h2 { margin: 0 0 0.5rem 0; color: #1976d2; }
    .calendar-view { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; min-height: 400px; }
  `]
})
export class CalendarModule implements IAppModule, OnInit, OnDestroy {
  readonly id = 'calendar';
  readonly name = 'Calendar';
  readonly type: ModuleType = 'calendar';
  
  @Input() eventBus?: IModuleEventBus;
  private subscriptions = ModuleEventHelper.createSubscriptionManager();
  
  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }
  
  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;
    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {})
    );
    ModuleEventHelper.publishModuleInitialized(eventBus, this.id);
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
