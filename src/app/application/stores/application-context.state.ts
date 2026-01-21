/**
 * Application Context State
 * 
 * Domain-Driven Design: Application Layer State
 * Layer: Application (Global Shell)
 * 
 * This state model represents the global application context that spans across
 * all bounded contexts. It follows the specification's layered architecture:
 * 
 * Identity Layer → Membership Layer → Workspace Layer → Module Layer → Entity Layer
 * 
 * Zone-less Architecture:
 * - All state is immutable and managed through signals
 * - No Zone.js dependency for change detection
 * - Updates trigger UI re-render via signal propagation
 */

/**
 * Identity Types (Identity Layer)
 * Represents the three types of authenticatable identities in the system
 */
export type IdentityType = 'user' | 'organization' | 'bot';

/**
 * Owner Types (Workspace Layer)
 * Only User and Organization can own workspaces (Bot cannot)
 */
export type WorkspaceOwnerType = 'user' | 'organization';

/**
 * Membership Types (Membership Layer)
 * Team and Partner are membership groupings, not authenticatable identities
 */
export type MembershipGroupType = 'team' | 'partner';

/**
 * Module Types (Module Layer)
 * Available functional modules that can be enabled in a workspace
 */
export type ModuleType = 'overview' | 'documents' | 'tasks' | 'settings' | 'calendar';

/**
 * Identity Model (Identity Layer)
 * Represents an authenticatable entity in the system
 */
export interface Identity {
  readonly id: string;
  readonly type: IdentityType;
  readonly displayName: string;
  readonly email: string | null;
  readonly avatarUrl: string | null;
}

/**
 * Workspace Model (Workspace Layer)
 * Represents a logical boundary for organizing work
 * Owned by either a User or an Organization (never by a Bot)
 */
export interface Workspace {
  readonly id: string;
  readonly name: string;
  readonly ownerId: string;
  readonly ownerType: WorkspaceOwnerType;
  readonly enabledModules: ReadonlyArray<ModuleType>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Module State (Module Layer)
 * Represents the currently active module within a workspace
 */
export interface ActiveModule {
  readonly type: ModuleType;
  readonly label: string;
  readonly path: string;
}

/**
 * Application Context State Model
 * 
 * This represents the complete global shell state following the
 * architectural specification:
 * 
 * - currentIdentity: The currently authenticated identity (User/Org/Bot)
 * - currentWorkspace: The active workspace context (owned by User/Org)
 * - currentModule: The active functional module within the workspace
 * - availableWorkspaces: All workspaces accessible by the current identity
 * - isLoading: Loading state for async operations
 * - error: Error state for failure handling
 */
export interface ApplicationContextState {
  readonly currentIdentity: Identity | null;
  readonly currentWorkspace: Workspace | null;
  readonly currentModule: ActiveModule | null;
  readonly availableWorkspaces: ReadonlyArray<Workspace>;
  readonly isLoading: boolean;
  readonly error: string | null;
}

/**
 * Initial State
 * 
 * Default state before any authentication or context selection
 * All values are null/empty to indicate uninitialized state
 */
export const initialApplicationContextState: ApplicationContextState = {
  currentIdentity: null,
  currentWorkspace: null,
  currentModule: null,
  availableWorkspaces: [],
  isLoading: false,
  error: null,
};
