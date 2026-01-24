/**
 * Workspace Event Effects
 *
 * Layer: Application
 * Purpose: Wire workspace events to module stores
 * Architecture: Event-driven integration between modules
 *
 * Responsibilities:
 * - Subscribe to workspace event bus
 * - Route events to appropriate stores
 * - Maintain event causality chain
 */

import { inject, Injectable, effect } from '@angular/core';
import { WorkspaceContextStore } from '@application/workspace/stores/workspace-context.store';
import { QualityControlStore } from '@application/quality-control/stores/quality-control.store';
import { AcceptanceStore } from '@application/acceptance/stores/acceptance.store';
import { IssuesStore } from '@application/issues/stores/issues.store';
import { AuditStore } from '@application/audit/stores/audit.store';
import { OverviewStore } from '@application/overview/stores/overview.store';
import { WORKSPACE_RUNTIME_FACTORY } from '@application/workspace/tokens/workspace-runtime.token';
import { DomainEvent } from '@domain/event/domain-event';

@Injectable({ providedIn: 'root' })
export class WorkspaceEventEffects {
  private readonly workspaceStore = inject(WorkspaceContextStore);
  private readonly qcStore = inject(QualityControlStore);
  private readonly acceptanceStore = inject(AcceptanceStore);
  private readonly issuesStore = inject(IssuesStore);
  private readonly auditStore = inject(AuditStore);
  private readonly overviewStore = inject(OverviewStore);
  private readonly runtimeFactory = inject(WORKSPACE_RUNTIME_FACTORY);

  constructor() {
    // Subscribe to workspace changes
    effect(() => {
      const workspace = this.workspaceStore.currentWorkspace();
      
      if (!workspace) {
        // Clear all module stores when no workspace
        this.clearAllStores();
        return;
      }
      
      // Get runtime for current workspace
      const runtime = this.runtimeFactory.getRuntime(workspace.id);
      if (!runtime) {
        return;
      }
      
      // Subscribe to event bus
      runtime.eventBus.subscribe((event) => {
        this.handleEvent(event, workspace.id);
      });
    });
  }

  private handleEvent(event: DomainEvent, workspaceId: string): void {
    // Always add to audit log
    this.auditStore.addEntry(event);

    // Route event to appropriate stores
    switch (event.eventType) {
      // Task events
      case 'TaskSubmittedForQC':
        this.handleTaskSubmittedForQC(event);
        break;

      // QC events
      case 'QCPassed':
        this.handleQCPassed(event);
        break;
      case 'QCFailed':
        this.handleQCFailed(event);
        break;

      // Acceptance events
      case 'AcceptancePassed':
        this.handleAcceptancePassed(event);
        break;
      case 'AcceptanceFailed':
        this.handleAcceptanceFailed(event);
        break;

      // Issue events
      case 'IssueResolved':
        this.handleIssueResolved(event);
        break;

      // All events update overview
      default:
        this.updateOverviewFromEvent(event);
        break;
    }
  }

  private handleTaskSubmittedForQC(event: DomainEvent): void {
    const payload = event.payload as {
      taskId: string;
      taskTitle: string;
      taskDescription?: string;
      submittedById: string;
    };

    this.qcStore.addToQueue(
      payload.taskId,
      payload.taskTitle,
      payload.taskDescription || '',
      payload.submittedById
    );
  }

  private handleQCPassed(event: DomainEvent): void {
    const payload = event.payload as {
      taskId: string;
      taskTitle: string;
    };

    // Move to acceptance queue with default checklist
    this.acceptanceStore.addToQueue(
      payload.taskId,
      payload.taskTitle,
      '',
      ['Functionality verified', 'Documentation complete', 'No regressions']
    );
  }

  private handleQCFailed(event: DomainEvent): void {
    const payload = event.payload as {
      taskId: string;
      taskTitle: string;
      failureReason: string;
      reviewedById: string;
    };

    const workspaceId = this.workspaceStore.currentWorkspace()?.id;
    if (!workspaceId) return;

    const runtime = this.runtimeFactory.getRuntime(workspaceId);
    if (!runtime) return;

    // Auto-create issue for QC failure
    this.issuesStore.createIssue({
      title: `QC Failed: ${payload.taskTitle}`,
      description: payload.failureReason,
      relatedTaskId: payload.taskId,
      relatedTaskTitle: payload.taskTitle,
      severity: 'high',
      createdById: payload.reviewedById,
      workspaceId,
      eventBus: runtime.eventBus,
      eventStore: runtime.eventStore,
      correlationId: event.correlationId,
      causationId: event.eventId,
    });
  }

  private handleAcceptancePassed(event: DomainEvent): void {
    // Task is complete, update overview stats
    this.updateOverviewFromEvent(event);
  }

  private handleAcceptanceFailed(event: DomainEvent): void {
    const payload = event.payload as {
      taskId: string;
      taskTitle: string;
      failureReason: string;
      rejectedById: string;
    };

    const workspaceId = this.workspaceStore.currentWorkspace()?.id;
    if (!workspaceId) return;

    const runtime = this.runtimeFactory.getRuntime(workspaceId);
    if (!runtime) return;

    // Auto-create issue for acceptance failure
    this.issuesStore.createIssue({
      title: `Acceptance Failed: ${payload.taskTitle}`,
      description: payload.failureReason,
      relatedTaskId: payload.taskId,
      relatedTaskTitle: payload.taskTitle,
      severity: 'high',
      createdById: payload.rejectedById,
      workspaceId,
      eventBus: runtime.eventBus,
      eventStore: runtime.eventStore,
      correlationId: event.correlationId,
      causationId: event.eventId,
    });
  }

  private handleIssueResolved(event: DomainEvent): void {
    // Update overview stats
    this.updateOverviewFromEvent(event);
  }

  private updateOverviewFromEvent(event: DomainEvent): void {
    // This would typically aggregate stats from all stores
    // Simplified version for now
    const userId = event.metadata.userId || 'system';
    
    this.overviewStore.addActivity({
      activityId: event.eventId,
      type: event.eventType,
      title: this.formatEventTitle(event),
      description: this.formatEventDescription(event),
      userId,
      userName: userId,
      timestamp: event.timestamp,
    });
  }

  private formatEventTitle(event: DomainEvent): string {
    return event.eventType
      .replace(/([A-Z])/g, ' $1')
      .trim();
  }

  private formatEventDescription(event: DomainEvent): string {
    const payload = event.payload as Record<string, unknown>;
    
    switch (event.eventType) {
      case 'TaskCreated':
        return `Created task: ${payload['title']}`;
      case 'QCPassed':
        return `QC passed for: ${payload['taskTitle']}`;
      case 'QCFailed':
        return `QC failed for: ${payload['taskTitle']}`;
      default:
        return event.eventType;
    }
  }

  private clearAllStores(): void {
    this.qcStore.reset();
    this.acceptanceStore.reset();
    this.issuesStore.reset();
    this.auditStore.reset();
    this.overviewStore.reset();
  }
}
