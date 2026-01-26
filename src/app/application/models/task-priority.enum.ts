/**
 * Task Priority Enum
 * 
 * Layer: Application
 * Purpose: Presentation-safe enum for task priority levels
 * 
 * Maps Domain TaskPriority to Application layer for UI consumption.
 * Prevents Presentation layer from directly importing Domain.
 */

export enum TaskPriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Convert Application enum to Domain enum (for use case handlers)
 */
export function toDomainTaskPriority(priority: TaskPriorityEnum): string {
  return priority as string;
}

/**
 * Convert Domain enum to Application enum (for view models)
 */
export function toAppTaskPriority(priority: string): TaskPriorityEnum {
  return priority as TaskPriorityEnum;
}
