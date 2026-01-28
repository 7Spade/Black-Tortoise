/**
 * Domain Layer - Events
 * Technical Barrel File
 */

// Acceptance
export * from '@domain/acceptance/events/acceptance-approved.event';
export * from '@domain/acceptance/events/acceptance-rejected.event';

// Audit
export * from '@domain/audit/events/audit-log-created.event';

// Daily
export * from '@domain/daily/events/daily-entry-created.event';

// Overview
export * from '@domain/overview/events/dashboard-refreshed.event';

// Documents
export * from '@domain/documents/events/document-uploaded.event';

// Base
export * from './domain-event';
export * from './event-metadata';
export * from './event-type';

// Issues
export * from '@domain/issues/events/issue-created.event';
export * from '@domain/issues/events/issue-resolved.event';

// Members
export * from '@domain/members/events/member-invited.event';
export * from '@domain/members/events/member-removed.event';

// System
export * from './module-activated.event';
export * from './module-deactivated.event';

// Identity
export * from './organization-created.event';
export * from '@domain/permissions/events/permission-granted.event';
export * from '@domain/permissions/events/permission-revoked.event';

// Quality Control
export * from '@domain/quality-control/events/qc-failed.event';
export * from '@domain/quality-control/events/qc-passed.event';

// Settings
export * from '@domain/settings/events/settings-updated.event';

// Tasks
export * from '@domain/tasks/events/task-completed.event';
export * from '@domain/tasks/events/task-created.event';
export * from '@domain/tasks/events/task-deleted.event';
export * from '@domain/tasks/events/task-submitted-for-qc.event';
export * from '@domain/tasks/events/task-updated.event';

// Workspace Context
export * from './workspace-created.event';
export * from './workspace-switched.event';
