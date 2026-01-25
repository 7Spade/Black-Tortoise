/**
 * Domain Events Index
 * 
 * Layer: Domain
 * Purpose: Centralized exports for all domain events
 */

// Workspace Events
export * from './workspace-created.event';
export * from './workspace-switched.event';

// Module Events
export * from './module-activated.event';
export * from './module-deactivated.event';

// Task Events
export * from './task-created.event';
export * from './task-completed.event';
export * from './task-submitted-for-qc.event';

// QC Events
export * from './qc-failed.event';
export * from './qc-passed.event';

// Acceptance Events
export * from './acceptance-approved.event';
export * from './acceptance-rejected.event';

// Issue Events
export * from './issue-created.event';
export * from './issue-resolved.event';

// Document Events
export * from './document-uploaded.event';

// Daily Events
export * from './daily-entry-created.event';

// Permission Events
export * from './permission-granted.event';
export * from './permission-revoked.event';

// Member Events
export * from './member-invited.event';
export * from './member-removed.event';
