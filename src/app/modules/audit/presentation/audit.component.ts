/**
 * Audit Module - Activity Tracking
 * Layer: Presentation
 * Read-only module that tracks all workspace events
 */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { AuditStore } from '@application/stores/audit.store';
import { ModuleEventHelper } from '@modules/shared/module-event-helper';

@Component({
  selector: 'app-audit-module',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="audit-module">
      <div class="module-header">
        <h2>?? Audit Log</h2>
        <p>
          Workspace: {{ eventBus?.workspaceId }} | Total Entries:
          {{ auditStore.totalEntries() }}
        </p>
      </div>

      <div class="audit-entries">
        <h3>Recent Activity ({{ auditStore.recentEntries().length }})</h3>
        @for (entry of auditStore.recentEntries(); track entry.id) {
          <div class="audit-entry">
            <div class="entry-header">
              <span class="event-type">{{ entry.eventType }}</span>
              <span class="timestamp">{{
                entry.timestamp.toLocaleString()
              }}</span>
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
  styleUrls: ['./audit.component.scss'],
})
export class AuditComponent implements IAppModule, OnInit, OnDestroy {
  readonly id = 'audit';
  readonly name = 'Audit';
  readonly type: ModuleType = 'audit';

  @Input() eventBus: IModuleEventBus | undefined;
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
    const eventTypes = [
      'TaskCreated',
      'TaskSubmittedForQC',
      'QCPassed',
      'QCFailed',
      'AcceptanceApproved',
      'AcceptanceRejected',
      'IssueCreated',
      'IssueResolved',
      'DailyEntryCreated',
    ];

    eventTypes.forEach((eventType) => {
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
        }),
      );
    });

    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.auditStore.clearEntries();
      }),
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
