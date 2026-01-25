/**
 * Audit Module - Activity Tracking
 * Layer: Presentation
 * Read-only module that tracks all workspace events
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { AuditStore } from '@application/audit/stores/audit.store';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';

@Component({
  selector: 'app-audit-module',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="audit-module">
      <div class="module-header">
        <h2>📊 Audit Log</h2>
        <p>Workspace: {{ eventBus?.workspaceId }} | Total Entries: {{ auditStore.totalEntries() }}</p>
      </div>
      
      <div class="audit-entries">
        <h3>Recent Activity ({{ auditStore.recentEntries().length }})</h3>
        @for (entry of auditStore.recentEntries(); track entry.id) {
          <div class="audit-entry">
            <div class="entry-header">
              <span class="event-type">{{ entry.eventType }}</span>
              <span class="timestamp">{{ entry.timestamp.toLocaleString() }}</span>
            </div>
            <div class="entry-details">
              <span>Actor: {{ entry.actorName }}</span>
              <span>Resource: {{ entry.resource }}</span>
              <span>Action: {{ entry.action }}</span>
            </div>
          </div>
        }
        @if (!auditStore.hasEntries()) {
          <div class="empty-state">No audit entries</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .audit-module { padding: 1.5rem; max-width: 1200px; }
    .module-header h2 { margin: 0 0 0.5rem 0; color: #1976d2; }
    .audit-entries { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; max-height: 600px; overflow-y: auto; }
    .audit-entry { border-left: 3px solid #1976d2; padding: 0.75rem; margin-bottom: 0.5rem; background: #f5f5f5; }
    .entry-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    .event-type { font-weight: bold; color: #1976d2; }
    .timestamp { font-size: 0.75rem; color: #666; }
    .entry-details { display: flex; gap: 1rem; font-size: 0.75rem; color: #666; }
    .empty-state { text-align: center; color: #999; padding: 2rem; }
  `]
})
export class AuditModule implements IAppModule, OnInit, OnDestroy {
  readonly id = 'audit';
  readonly name = 'Audit';
  readonly type: ModuleType = 'audit';
  
  @Input() eventBus?: IModuleEventBus;
  readonly auditStore = inject(AuditStore);
  
  private subscriptions = ModuleEventHelper.createSubscriptionManager();
  
  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }
  
  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;
    
    // Subscribe to ALL events for audit logging
    const eventTypes = ['TaskCreated', 'TaskSubmittedForQC', 'QCPassed', 'QCFailed', 
                       'AcceptanceApproved', 'AcceptanceRejected', 'IssueCreated', 
                       'IssueResolved', 'DailyEntryCreated'];
    
    eventTypes.forEach(eventType => {
      this.subscriptions.add(
        eventBus.subscribe(eventType, (event: any) => {
          this.auditStore.addEntry({
            timestamp: new Date(event.timestamp),
            eventType: event.eventType,
            actorId: event.metadata?.userId || 'system',
            actorName: event.metadata?.userId || 'System',
            resource: event.aggregateId,
            action: eventType,
            details: event.payload,
            correlationId: event.correlationId,
          });
        })
      );
    });
    
    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.auditStore.clearEntries();
      })
    );
    
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
