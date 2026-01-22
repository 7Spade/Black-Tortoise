/**
 * Workspace Create Dialog Result Model
 * 
 * Layer: Presentation - Models
 * Purpose: Plain result type for workspace creation dialog payload
 * Architecture: Pure TypeScript interface, no framework dependencies
 */

/**
 * Dialog result type for workspace creation
 */
export interface WorkspaceCreateResult {
  readonly workspaceName: string;
}
