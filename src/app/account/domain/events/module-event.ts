/**
 * Module Domain Events
 * 
 * Layer: Domain
 * Purpose: Events specific to module lifecycle and interactions
 * No Angular or RxJS dependencies
 */

import { DomainEvent } from '@domain/events';

export interface ModuleInitializedPayload {
  readonly moduleId: string;
  readonly workspaceId: string;
}

/**
 * Module Initialized Event
 * Published when a module is initialized in a workspace
 */
export interface ModuleInitialized extends DomainEvent<ModuleInitializedPayload> {
  readonly type: 'ModuleInitialized';
}

export interface ModuleDataChangedPayload {
  readonly moduleId: string;
  readonly workspaceId: string;
  readonly dataType: string;
  readonly data: unknown;
}

/**
 * Module Data Changed Event
 * Generic event for module data changes
 */
export interface ModuleDataChanged extends DomainEvent<ModuleDataChangedPayload> {
  readonly type: 'ModuleDataChanged';
}

export interface ModuleErrorPayload {
  readonly moduleId: string;
  readonly workspaceId: string;
  readonly error: string;
}

/**
 * Module Error Event
 */
export interface ModuleError extends DomainEvent<ModuleErrorPayload> {
  readonly type: 'ModuleError';
}

