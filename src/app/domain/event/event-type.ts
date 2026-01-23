/**
 * Event Type Constants
 * 
 * Layer: Domain
 * Purpose: Centralized event type definitions for type safety
 * 
 * Event Semantics:
 * - All event types use past tense (e.g., "Created", "Updated")
 * - Event types are domain-specific and business-focused
 * - Used for event routing, filtering, and type discrimination
 */

export const EventType = {
  // Workspace Events
  WORKSPACE_CREATED: 'WorkspaceCreated',
  WORKSPACE_SWITCHED: 'WorkspaceSwitched',
  WORKSPACE_RENAMED: 'WorkspaceRenamed',
  WORKSPACE_DEACTIVATED: 'WorkspaceDeactivated',
  WORKSPACE_REACTIVATED: 'WorkspaceReactivated',
  WORKSPACE_OWNERSHIP_TRANSFERRED: 'WorkspaceOwnershipTransferred',
  
  // Module Events
  MODULE_ACTIVATED: 'ModuleActivated',
  MODULE_DEACTIVATED: 'ModuleDeactivated',
  MODULE_REGISTERED: 'ModuleRegistered',
  MODULE_UNREGISTERED: 'ModuleUnregistered',
  
  // Task Events
  TASK_CREATED: 'TaskCreated',
  TASK_UPDATED: 'TaskUpdated',
  TASK_COMPLETED: 'TaskCompleted',
  TASK_DELETED: 'TaskDeleted',
  
  // Document Events
  DOCUMENT_UPLOADED: 'DocumentUploaded',
  DOCUMENT_DELETED: 'DocumentDeleted',
  DOCUMENT_SHARED: 'DocumentShared',
} as const;

export type EventTypeValue = typeof EventType[keyof typeof EventType];
