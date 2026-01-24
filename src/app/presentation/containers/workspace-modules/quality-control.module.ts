/**
 * Quality Control Module
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';
import { QualityControlPageComponent } from '@presentation/features/quality-control/quality-control-page.component';

@Component({
  selector: 'app-quality-control-module',
  standalone: true,
  imports: [CommonModule, QualityControlPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<app-quality-control-page />',
})
export class QualityControlModule implements IAppModule, OnInit {
  readonly id = 'quality-control';
  readonly name = 'Quality Control';
  readonly type: ModuleType = 'quality-control';
  
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
