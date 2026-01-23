/**
 * Domain Event Base Interface
 * 
 * Layer: Domain
 * Purpose: Base interface for all domain events in the system
 * No dependencies on Angular or RxJS
 * 
 * Event Sourcing & CQRS Pattern:
 * - eventId: Unique identifier for this event instance
 * - eventType: Type discriminator for event handling
 * - aggregateId: The aggregate root this event belongs to
 * - workspaceId: Workspace context for multi-tenancy
 * - timestamp: When the event occurred
 * - causalityId: Causality chain tracking (event sourcing)
 * - payload: Event-specific data
 * - metadata: Additional tracking information
 */

export interface DomainEvent<TPayload = Record<string, unknown>> {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly workspaceId: string;
  readonly timestamp: Date;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly payload: TPayload;
  readonly metadata: EventMetadata;
}

/**
 * Event Metadata for tracking and correlation
 */
export interface EventMetadata {
  readonly version: number;
  readonly userId?: string;
}

/**
 * Workspace Domain Events
 */
export interface WorkspaceCreatedPayload {
  readonly ownerId: string;
  readonly ownerType: 'user' | 'organization';
  readonly name: string;
}

export interface WorkspaceCreated extends DomainEvent<WorkspaceCreatedPayload> {
  readonly eventType: 'WorkspaceCreated';
}

export interface WorkspaceSwitchedPayload {
  readonly previousWorkspaceId: string | null;
  readonly currentWorkspaceId: string;
}

export interface WorkspaceSwitched extends DomainEvent<WorkspaceSwitchedPayload> {
  readonly eventType: 'WorkspaceSwitched';
}

export interface ModuleActivatedPayload {
  readonly moduleId: string;
}

export interface ModuleActivated extends DomainEvent<ModuleActivatedPayload> {
  readonly eventType: 'ModuleActivated';
}

export interface ModuleDeactivatedPayload {
  readonly moduleId: string;
}

export interface ModuleDeactivated extends DomainEvent<ModuleDeactivatedPayload> {
  readonly eventType: 'ModuleDeactivated';
}
