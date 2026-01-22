/**
 * Workspace Create Result Model
 * 
 * Layer: Application - Models
 * Purpose: DTO for workspace creation operations
 * Architecture: Pure TypeScript interface, no framework dependencies
 * 
 * Clean Architecture Compliance:
 * - Application layer model used by use cases and facades
 * - Can be used by both Application and Presentation layers
 * - Pure data structure with no business logic
 */

/**
 * Result type for workspace creation
 * Used as a data transfer object between layers
 */
export interface WorkspaceCreateResult {
  readonly workspaceName: string;
}
