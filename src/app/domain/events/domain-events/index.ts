/**
 * Domain Events Index
 * 
 * Layer: Domain
 * Purpose: Centralized exports for all domain events
 */

// Workspace Events
export * from './workspace-created.event';
export * from './workspace-switched.event';

// Task Events
export * from './task-created.event';
export * from './task-completed.event';
export * from './task-submitted-for-qc.event';

// QC Events
export * from './qc-failed.event';

// Issue Events
export * from './issue-created.event';
export * from './issue-resolved.event';

// Document Events
export * from './document-uploaded.event';
