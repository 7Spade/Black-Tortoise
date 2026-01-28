/**
 * Handle Domain Event Use Case
 * 
 * Layer: Application
 * Purpose: Centralized domain event handler for cross-cutting concerns
 */

import { Injectable } from '@angular/core';
import { DomainEvent } from '@events';

/**
 * Domain Event Handler Use Case
 * 
 * This use case provides a centralized handler for domain events.
 * It can be extended to handle logging, analytics, notifications, etc.
 */
@Injectable({ providedIn: 'root' })
export class HandleDomainEventHandler {
  
  execute<TPayload>(event: DomainEvent<TPayload>): void {
    // Handle different event types
    switch (event.type) {
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
        console.log('[HandleDomainEventHandler] Unhandled event:', event);
    }
    
    // Cross-cutting concerns
    this.logEvent(event);
    this.trackCausation(event);
  }
  
  private handleWorkspaceCreated<TPayload>(event: DomainEvent<TPayload>): void {
    console.log('[HandleDomainEventHandler] Workspace created event:', event);
    // Could trigger: welcome notification, analytics, etc.
  }
  
  private handleWorkspaceSwitched<TPayload>(event: DomainEvent<TPayload>): void {
    console.log('[HandleDomainEventHandler] Workspace switched event:', event);
    // Could trigger: context cleanup, state reset, etc.
  }
  
  private handleModuleActivated<TPayload>(event: DomainEvent<TPayload>): void {
    console.log('[HandleDomainEventHandler] Module activated event:', event);
    // Could trigger: module analytics, lazy loading, etc.
  }
  
  private handleModuleDeactivated<TPayload>(event: DomainEvent<TPayload>): void {
    console.log('[HandleDomainEventHandler] Module deactivated event:', event);
    // Could trigger: state persistence, cleanup, etc.
  }
  
  private logEvent<TPayload>(event: DomainEvent<TPayload>): void {
    console.log('[Event Log]', {
      eventId: event.eventId,
      eventType: event.type,
      timestamp: event.timestamp,
      causationId: event.causationId,
      correlationId: event.correlationId,
    });
  }
  
  private trackCausation<TPayload>(event: DomainEvent<TPayload>): void {
    if (event.causationId) {
      console.log('[Causation Tracking]', {
        current: event.eventId,
        causedBy: event.causationId,
        correlation: event.correlationId,
      });
    }
  }
}

