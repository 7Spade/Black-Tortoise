/**
 * Application Layer - Public API
 * 
 * Exports all public interfaces, tokens, facades, and services
 * for use by Presentation layer and external consumers
 */

// Interfaces
export * from './workspace/interfaces/workspace-runtime-factory.interface';
export * from './interfaces/module-event-bus.interface';
export * from './interfaces/module.interface';

// Tokens
export * from './workspace/tokens/workspace-runtime.token';

// Adapters
export * from './workspace/adapters/workspace-event-bus.adapter';

// Facades
export * from './facades/module.facade';
export * from './facades/header.facade';
export * from './facades/shell.facade';
export * from './workspace/facades/workspace-host.facade';
export * from './facades/search.facade';
export * from './facades/notification.facade';

// Stores
export * from './workspace/stores/workspace-context.store';
export * from './stores/presentation.store';

// Models
export * from './workspace/models/workspace-create-result.model';

// Use Cases
export * from './workspace/use-cases/create-workspace.use-case';
export * from './workspace/use-cases/switch-workspace.use-case';
export * from './workspace/use-cases/handle-domain-event.use-case';
export * from './workspace/facades/identity.facade';
export * from './workspace/facades/workspace.facade';
