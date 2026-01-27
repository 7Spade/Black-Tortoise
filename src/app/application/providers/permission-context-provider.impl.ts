/**
 * Permission Context Provider Implementation
 * 
 * Layer: Application
 * Purpose: Concrete implementation wrapping PermissionsStore
 */

import { Injectable, inject } from '@angular/core';
import { PermissionsStore } from '@application/stores/permissions.store';
import { PermissionContextProvider } from './permission-context.provider';

@Injectable()
export class PermissionContextProviderImpl extends PermissionContextProvider {
  private readonly store = inject(PermissionsStore);

  /**
   * Check if user has specific permission
   */
  hasPermission(userId: string, permission: string): boolean {
    const userRole = this.getUserRole(userId);
    if (!userRole) return false;

    const permissions = this.getRolePermissions(userRole);
    return permissions.includes(permission);
  }

  /**
   * Get user's role ID
   */
  getUserRole(userId: string): string | null {
    // For now, we use currentUserRoleId from store
    // In a full implementation, this would look up user->role mapping
    return this.store.currentUserRoleId();
  }

  /**
   * Get all permissions for a role
   */
  getRolePermissions(roleId: string): string[] {
    const permissions = this.store.getPermissionsForRole()(roleId);
    return permissions.map(p => `${p.resource}:${p.action}`);
  }

  /**
   * Check if role exists
   */
  roleExists(roleId: string): boolean {
    return this.store.roles().some(r => r.roleId === roleId);
  }
}
