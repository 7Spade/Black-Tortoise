/**
 * Role Templates
 * 
 * Layer: Domain
 * Purpose: Pre-configured role templates for common use cases
 */

export interface RoleTemplate {
  readonly name: string;
  readonly description: string;
  readonly permissions: ReadonlyArray<string>;
  readonly color: string;
}

/**
 * Predefined role templates
 */
export const ROLE_TEMPLATES: Record<string, RoleTemplate> = {
  PROJECT_MANAGER: {
    name: 'Project Manager',
    description: 'Can manage tasks, approve QC, and view reports',
    permissions: [
      'tasks:read',
      'tasks:create',
      'tasks:update',
      'tasks:delete',
      'qc:read',
      'qc:approve',
      'reports:read',
    ],
    color: '#2196F3',
  },
  DEVELOPER: {
    name: 'Developer',
    description: 'Can manage code and submit QC',
    permissions: [
      'tasks:read',
      'tasks:create',
      'tasks:update',
      'code:read',
      'code:create',
      'code:update',
      'code:delete',
      'qc:read',
      'qc:create',
    ],
    color: '#4CAF50',
  },
  TESTER: {
    name: 'Tester',
    description: 'Can view tasks, manage QC, and create bugs',
    permissions: [
      'tasks:read',
      'qc:read',
      'qc:create',
      'qc:update',
      'bugs:read',
      'bugs:create',
    ],
    color: '#FF9800',
  },
  GUEST: {
    name: 'Guest',
    description: 'Read-only access to tasks and reports',
    permissions: [
      'tasks:read',
      'reports:read',
    ],
    color: '#9E9E9E',
  },
};
