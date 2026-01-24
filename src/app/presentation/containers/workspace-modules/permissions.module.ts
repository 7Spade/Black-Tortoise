import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';
import { PermissionsPageComponent } from '@presentation/features/permissions/permissions-page.component';

@Component({
  selector: 'app-permissions-module',
  standalone: true,
  imports: [CommonModule, PermissionsPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<app-permissions-page />',
})
export class PermissionsModule implements IAppModule, OnInit {
  readonly id = 'permissions';
  readonly name = 'Permissions';
  readonly type: ModuleType = 'permissions';
  
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
