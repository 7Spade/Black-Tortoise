/**
 * Domain Layer - Events
 * Technical Barrel File
 */

// Acceptance
export * from '../acceptance/events/acceptance-approved.event';
export * from '../acceptance/events/acceptance-rejected.event';

// Audit
export * from '../audit/events/audit-log-created.event';

// Daily
export * from '../daily/events/daily-entry-created.event';

// Overview
export * from '../overview/events/dashboard-refreshed.event';

// Documents
export * from '../documents/events/document-uploaded.event';

// Base
export * from './domain-event';
export * from './event-metadata';
export * from './event-type';

// Issues
export * from '../issues/events/issue-created.event';
export * from '../issues/events/issue-resolved.event';

// Members
export * from '../members/events/member-invited.event';
export * from '../members/events/member-removed.event';

// System
export * from './module-activated.event';
export * from './module-deactivated.event';

// Identity
export * from './organization-created.event';
export * from '../permissions/events/permission-granted.event';
export * from '../permissions/events/permission-revoked.event';

// Quality Control
export * from '../quality-control/events/qc-failed.event';
export * from '../quality-control/events/qc-passed.event';

// Settings
export * from '../settings/events/settings-updated.event';

// Tasks
export * from '../tasks/events/task-completed.event';
export * from '../tasks/events/task-created.event';
export * from '../tasks/events/task-deleted.event';
export * from '../tasks/events/task-submitted-for-qc.event';
export * from '../tasks/events/task-updated.event';

// Workspace Context
export * from './workspace-created.event';
export * from './workspace-switched.event';
