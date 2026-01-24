/**
 * Overview Module
 * 
 * Layer: Presentation
 * Purpose: Workspace overview dashboard module
 * Architecture: Event-driven, Zone-less
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';
import { OverviewPageComponent } from '@presentation/features/overview/overview-page.component';

@Component({
  selector: 'app-overview-module',
  standalone: true,
  imports: [CommonModule, OverviewPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<app-overview-page />',
})
export class OverviewModule implements IAppModule, OnInit {
  readonly id = 'overview';
  readonly name = 'Overview';
  readonly type: ModuleType = 'overview';
  
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
