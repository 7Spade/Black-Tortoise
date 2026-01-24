import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';
import { AcceptancePageComponent } from '@presentation/features/acceptance/acceptance-page.component';

@Component({
  selector: 'app-acceptance-module',
  standalone: true,
  imports: [CommonModule, AcceptancePageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<app-acceptance-page />',
})
export class AcceptanceModule implements IAppModule, OnInit {
  readonly id = 'acceptance';
  readonly name = 'Acceptance';
  readonly type: ModuleType = 'acceptance';
  
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
