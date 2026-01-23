/**
 * Application - Workspace Module
 * Barrel exports for workspace application layer
 */

// Use Cases
export * from './use-cases/create-workspace.use-case';
export * from './use-cases/switch-workspace.use-case';

// Facades
export * from './facades/workspace.facade';
export * from './facades/workspace-host.facade';
export * from './facades/identity.facade';

// Stores
export * from './stores/workspace-context.store';

// Models
export * from './models/workspace-create-result.model';
export * from './models/workspace-create-result.validator';

// Tokens
export * from './tokens/workspace-runtime.token';

// Interfaces
export * from './interfaces/workspace-runtime-factory.interface';

// Adapters
export * from './adapters/workspace-event-bus.adapter';
