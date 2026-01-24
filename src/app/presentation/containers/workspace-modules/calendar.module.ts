import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';
import { CalendarPageComponent } from '@presentation/features/calendar/calendar-page.component';

@Component({
  selector: 'app-calendar-module',
  standalone: true,
  imports: [CommonModule, CalendarPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<app-calendar-page />',
})
export class CalendarModule implements IAppModule, OnInit {
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
