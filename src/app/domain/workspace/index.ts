/**
 * Domain - Workspace Module
 * Barrel exports for workspace domain layer
 */

// Entities
export * from './entities/workspace.entity';

// Value Objects
export * from './value-objects/workspace-id.vo';

// Aggregates
export * from './aggregates/workspace.aggregate';

// Services
export * from './services/workspace-domain.service';

// Repositories
export * from './repositories/workspace.repository';

// Interfaces
export * from './interfaces/workspace-context';
export * from './interfaces/workspace-event-bus.interface';
