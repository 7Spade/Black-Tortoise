/**
 * Domain - Workspace Module
 * Barrel exports for workspace domain layer
 */

// Entities
export { addModuleToWorkspace, createWorkspace as createWorkspaceEntity, removeModuleFromWorkspace, WorkspaceEntity } from './aggregates/workspace.entity';

// Value Objects
export { WorkspaceId } from './value-objects/workspace-id.vo';

// Aggregates
export { createWorkspace, deactivateWorkspace, reactivateWorkspace, renameWorkspace, transferWorkspaceOwnership, WorkspaceAggregate } from './aggregates/workspace.aggregate';

// Repositories
export * from './repositories/workspace.repository';

// Interfaces
export * from './interfaces/workspace-context';
export * from './interfaces/workspace-event-bus.interface';
export * from './policies';

