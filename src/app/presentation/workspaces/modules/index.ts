/**
 * Workspace Modules Public API
 * 
 * Layer: Presentation - Workspace Feature
 * Purpose: All workspace module implementations
 * 
 * Exports all 11 standard workspace modules:
 * - Overview, Documents, Tasks, Calendar, Daily
 * - Quality Control, Acceptance, Issues
 * - Members, Permissions, Audit, Settings
 */

export * from './acceptance.module';
export * from './audit.module';
export * from './calendar.module';
export * from './daily.module';
export * from './documents.module';
export * from './issues.module';
export * from './members.module';
export * from './overview.module';
export * from './permissions.module';
export * from './quality-control.module';
export * from './settings.module';
export * from './tasks.module';

// Base module utilities
export * from './basic';
