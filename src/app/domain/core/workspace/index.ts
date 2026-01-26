/**
 * Domain - Workspace Module
 * Barrel exports for workspace domain layer
 */

// Entities
export { WorkspaceEntity, createWorkspace as createWorkspaceEntity, addModuleToWorkspace, removeModuleFromWorkspace } from './entities/workspace.entity';

// Value Objects
export { WorkspaceId } from './value-objects/workspace-id.vo';

// Aggregates
export { WorkspaceAggregate, createWorkspace, renameWorkspace, deactivateWorkspace, reactivateWorkspace, transferWorkspaceOwnership } from './aggregates/workspace.aggregate';

// Services
export * from './services/workspace-domain.service';

// Repositories
export * from './repositories/workspace.repository';

// Interfaces
export * from './interfaces/workspace-context';
export * from './interfaces/workspace-event-bus.interface';
