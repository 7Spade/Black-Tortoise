/**
 * Handle Domain Event Use Case
 * 
 * Layer: Application
 * Purpose: Centralized domain event handler for cross-cutting concerns
 */

import { Injectable } from '@angular/core';
import { DomainEvent } from '@domain/event/domain-event';

/**
 * Domain Event Handler Use Case
 * 
 * This use case provides a centralized handler for domain events.
 * It can be extended to handle logging, analytics, notifications, etc.
 */
@Injectable({ providedIn: 'root' })
export class HandleDomainEventUseCase {
  
  execute(event: DomainEvent): void {
    // Handle different event types
    switch (event.eventType) {
      case 'WorkspaceCreated':
        this.handleWorkspaceCreated(event);
        break;
      case 'WorkspaceSwitched':
        this.handleWorkspaceSwitched(event);
        break;
      case 'ModuleActivated':
        this.handleModuleActivated(event);
        break;
      case 'ModuleDeactivated':
        this.handleModuleDeactivated(event);
        break;
      default:
        console.log('[HandleDomainEventUseCase] Unhandled event:', event);
    }
    
    // Cross-cutting concerns
    this.logEvent(event);
    this.trackCausation(event);
  }
  
  private handleWorkspaceCreated(event: DomainEvent): void {
    console.log('[HandleDomainEventUseCase] Workspace created event:', event);
    // Could trigger: welcome notification, analytics, etc.
  }
  
  private handleWorkspaceSwitched(event: DomainEvent): void {
    console.log('[HandleDomainEventUseCase] Workspace switched event:', event);
    // Could trigger: context cleanup, state reset, etc.
  }
  
  private handleModuleActivated(event: DomainEvent): void {
    console.log('[HandleDomainEventUseCase] Module activated event:', event);
    // Could trigger: module analytics, lazy loading, etc.
  }
  
  private handleModuleDeactivated(event: DomainEvent): void {
    console.log('[HandleDomainEventUseCase] Module deactivated event:', event);
    // Could trigger: state persistence, cleanup, etc.
  }
  
  private logEvent(event: DomainEvent): void {
    console.log('[Event Log]', {
      eventId: event.eventId,
      eventType: event.eventType,
      occurredAt: event.timestamp,
      causationId: event.causationId,
      correlationId: event.correlationId,
    });
  }
  
  private trackCausation(event: DomainEvent): void {
    if (event.causationId) {
      console.log('[Causation Tracking]', {
        current: event.eventId,
        causedBy: event.causationId,
        correlation: event.correlationId,
      });
    }
  }
}
