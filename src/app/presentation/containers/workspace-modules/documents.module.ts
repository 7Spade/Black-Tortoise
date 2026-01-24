import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';
import { DocumentsPageComponent } from '@presentation/features/documents/documents-page.component';

@Component({
  selector: 'app-documents-module',
  standalone: true,
  imports: [CommonModule, DocumentsPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<app-documents-page />',
})
export class DocumentsModule implements IAppModule, OnInit {
  readonly id = 'documents';
  readonly name = 'Documents';
  readonly type: ModuleType = 'documents';
  
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
