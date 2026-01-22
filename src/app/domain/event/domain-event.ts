/**
 * Domain Event Base Interface
 * 
 * Layer: Domain
 * Purpose: Base interface for all domain events in the system
 * No dependencies on Angular or RxJS
 */

export interface DomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly occurredAt: Date;
  readonly causationId?: string; // For event causation tracking
  readonly correlationId?: string; // For event correlation across aggregates
}

/**
 * Workspace Domain Events
 */
export interface WorkspaceCreated extends DomainEvent {
  readonly eventType: 'WorkspaceCreated';
  readonly workspaceId: string;
  readonly ownerId: string;
  readonly ownerType: 'user' | 'organization';
}

export interface WorkspaceSwitched extends DomainEvent {
  readonly eventType: 'WorkspaceSwitched';
  readonly previousWorkspaceId: string | null;
  readonly currentWorkspaceId: string;
}

export interface ModuleActivated extends DomainEvent {
  readonly eventType: 'ModuleActivated';
  readonly workspaceId: string;
  readonly moduleId: string;
}

export interface ModuleDeactivated extends DomainEvent {
  readonly eventType: 'ModuleDeactivated';
  readonly workspaceId: string;
  readonly moduleId: string;
}
