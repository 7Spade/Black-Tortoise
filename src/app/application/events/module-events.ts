/**
 * Module Events (Application Layer)
 * 
 * Layer: Application
 * Purpose: Application-layer DTOs for module lifecycle events
 * 
 * These mirror the Domain events but provide a stable contract
 * for the Presentation layer without direct Domain dependencies.
 * 
 * Clean Architecture Compliance:
 * - Presentation uses these Application DTOs
 * - Application layer maps between Domain events and DTOs
 * - Domain events remain internal to Domain/Application
 */

/**
 * Base event interface
 */
export interface AppEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly timestamp: number;
}

/**
 * Module Initialized Event
 * Published when a module is initialized in a workspace
 */
export interface ModuleInitialized extends AppEvent {
  readonly eventType: 'ModuleInitialized';
  readonly moduleId: string;
  readonly workspaceId: string;
}

/**
 * Module Data Changed Event
 * Generic event for module data changes
 */
export interface ModuleDataChanged<T = Record<string, never>> extends AppEvent {
  readonly eventType: 'ModuleDataChanged';
  readonly moduleId: string;
  readonly workspaceId: string;
  readonly dataType: string;
  readonly data: T;
}

/**
 * Module Error Event
 */
export interface ModuleError extends AppEvent {
  readonly eventType: 'ModuleError';
  readonly moduleId: string;
  readonly workspaceId: string;
  readonly error: string;
}

/**
 * Module Activated Event
 */
export interface ModuleActivated extends AppEvent {
  readonly eventType: 'ModuleActivated';
  readonly moduleId: string;
  readonly workspaceId: string;
}

/**
 * Module Deactivated Event
 */
export interface ModuleDeactivated extends AppEvent {
  readonly eventType: 'ModuleDeactivated';
  readonly moduleId: string;
  readonly workspaceId: string;
}

/**
 * Workspace Switched Event
 */
export interface WorkspaceSwitched extends AppEvent {
  readonly eventType: 'WorkspaceSwitched';
  readonly previousWorkspaceId: string | null;
  readonly currentWorkspaceId: string;
}
