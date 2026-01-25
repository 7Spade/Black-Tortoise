/**
 * Tasks Feature - Public API
 * 
 * Layer: Application
 * Purpose: Centralized exports for tasks feature
 * 
 * Re-exports domain types for Presentation layer use (DDD boundary compliance)
 */

// Store
export { TasksStore } from './stores/tasks.store';
export type { TasksState } from './stores/tasks.store';

// Use Cases
export { CreateTaskUseCase } from './use-cases/create-task.use-case';
export { SubmitTaskForQCUseCase } from './use-cases/submit-task-for-qc.use-case';
export type { CreateTaskRequest, CreateTaskResponse } from './use-cases/create-task.use-case';
export type { SubmitTaskForQCRequest, SubmitTaskForQCResponse } from './use-cases/submit-task-for-qc.use-case';

// Event Handlers
export { registerTasksEventHandlers } from './handlers/tasks.event-handlers';

// Domain types re-exported for Presentation layer (DDD boundary compliance)
// Presentation must not import directly from Domain - use Application as facade
export type { TaskEntity, TaskStatus, TaskPriority } from '@domain/task/task.entity';
export { createTask, updateTaskStatus } from '@domain/task/task.entity';
