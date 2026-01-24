import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';
import { AuditPageComponent } from '@presentation/features/audit/audit-page.component';

@Component({
  selector: 'app-audit-module',
  standalone: true,
  imports: [CommonModule, AuditPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<app-audit-page />',
})
export class AuditModule implements IAppModule, OnInit {
  readonly id = 'audit';
  readonly name = 'Audit';
  readonly type: ModuleType = 'audit';
  
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
