import type { WorkspaceQuota } from '@domain/workspace/value-objects/workspace-quota.value-object';

/**
 * QuotaEnforcer is a domain service for enforcing workspace quotas.
 */
export interface QuotaEnforcer {
  /**
   * Check if adding members would exceed quota.
   */
  checkMemberQuota(quota: WorkspaceQuota, currentCount: number, toAdd: number): boolean;

  /**
   * Check if adding storage would exceed quota.
   */
  checkStorageQuota(quota: WorkspaceQuota, currentUsage: number, toAdd: number): boolean;

  /**
   * Check if adding projects would exceed quota.
   */
  checkProjectQuota(quota: WorkspaceQuota, currentCount: number, toAdd: number): boolean;
}
