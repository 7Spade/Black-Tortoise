/**
 * Module Domain Events
 * 
 * Layer: Domain
 * Purpose: Events specific to module lifecycle and interactions
 * No Angular or RxJS dependencies
 */

import { DomainEvent } from '@domain/event/domain-event';

/**
 * Module Initialized Event
 * Published when a module is initialized in a workspace
 */
export interface ModuleInitialized extends DomainEvent {
  readonly eventType: 'ModuleInitialized';
  readonly moduleId: string;
  readonly workspaceId: string;
}

/**
 * Module Data Changed Event
 * Generic event for module data changes
 */
export interface ModuleDataChanged extends DomainEvent {
  readonly eventType: 'ModuleDataChanged';
  readonly moduleId: string;
  readonly workspaceId: string;
  readonly dataType: string;
  readonly data: unknown;
}

/**
 * Module Error Event
 */
export interface ModuleError extends DomainEvent {
  readonly eventType: 'ModuleError';
  readonly moduleId: string;
  readonly workspaceId: string;
  readonly error: string;
}
