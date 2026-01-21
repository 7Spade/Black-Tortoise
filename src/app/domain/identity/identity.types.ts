/**
 * IdentityType is restricted to user, organization, and bot only.
 * Using union type as the single source of truth.
 */
export type IdentityType = 'user' | 'organization' | 'bot';

/**
 * WorkspaceOwnerType is restricted to user or organization for workspace ownership.
 */
export type WorkspaceOwnerType = 'user' | 'organization';
