/**
 * Workspace Create Result Validator
 * 
 * Layer: Application - Models
 * Purpose: Type guard for validating workspace creation dialog results
 */

import { WorkspaceCreateResult } from './workspace-create-result.model';

/**
 * Type guard to validate WorkspaceCreateResult
 * @param result - Unknown value to validate
 * @returns True if result is a valid WorkspaceCreateResult
 */
export function isValidWorkspaceCreateResult(result: unknown): result is WorkspaceCreateResult {
  return (
    result !== null &&
    result !== undefined &&
    typeof result === 'object' &&
    'workspaceName' in result &&
    typeof (result as WorkspaceCreateResult).workspaceName === 'string' &&
    (result as WorkspaceCreateResult).workspaceName.trim().length > 0
  );
}
