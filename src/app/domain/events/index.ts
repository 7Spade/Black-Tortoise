/**
 * Domain Layer - Events
 * Technical Barrel File
 */

// Acceptance
export * from '@acceptance/domain/events/acceptance-approved.event';
export * from '@acceptance/domain/events/acceptance-rejected.event';

// Audit
export * from '@audit/domain/events/audit-log-created.event';

// Daily
export * from '@daily/domain/events/daily-entry-created.event';

// Overview
export * from '@overview/domain/events/dashboard-refreshed.event';

// Documents
export * from '@documents/domain/events/document-uploaded.event';

// Base
export * from './domain-event';
export * from './event-metadata';
export * from './event-type';

// Issues
export * from '@issues/domain/events/issue-created.event';
export * from '@issues/domain/events/issue-resolved.event';

// Members
export * from '@members/domain/events/member-invited.event';
export * from '@members/domain/events/member-removed.event';

// System
export * from './module-activated.event';
export * from './module-deactivated.event';

// Identity
export * from './organization-created.event';
export * from '@permissions/domain/events/permission-granted.event';
export * from '@permissions/domain/events/permission-revoked.event';

// Quality Control
export * from '@quality-control/domain/events/qc-failed.event';
export * from '@quality-control/domain/events/qc-passed.event';

// Settings
export * from '@settings/domain/events/settings-updated.event';

// Tasks
export * from '@tasks/domain/events/task-completed.event';
export * from '@tasks/domain/events/task-created.event';
export * from '@tasks/domain/events/task-deleted.event';
export * from '@tasks/domain/events/task-submitted-for-qc.event';
export * from '@tasks/domain/events/task-updated.event';

// Workspace Context
export * from './workspace-created.event';
export * from './workspace-switched.event';

