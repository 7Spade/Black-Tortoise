/**
 * Tasks Feature - Public API
 * 
 * Layer: Application
 * Purpose: Centralized exports for tasks feature
 * 
 * Re-exports domain types for Presentation layer use (DDD boundary compliance)
 */

export * from './handlers';
export * from './stores';
export * from './use-cases';

// Domain types re-exported for Presentation layer (DDD boundary compliance)
// Presentation must not import directly from Domain - use Application as facade
export { TaskEntity, TaskStatus, TaskPriority } from '@domain/task/task.entity';
export { createTask, updateTaskStatus } from '@domain/task/task.entity';
