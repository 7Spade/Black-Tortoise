import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';
import { DailyPageComponent } from '@presentation/features/daily/daily-page.component';

@Component({
  selector: 'app-daily-module',
  standalone: true,
  imports: [CommonModule, DailyPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<app-daily-page />',
})
export class DailyModule implements IAppModule, OnInit {
  readonly id = 'daily';
  readonly name = 'Daily';
  readonly type: ModuleType = 'daily';
  
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
