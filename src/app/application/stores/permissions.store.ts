/**
 * Permissions Store
 *
 * Layer: Application - Store
 * Purpose: Manages RBAC permissions state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+, NO RxJS
 *
 * Responsibilities:
 * - Manage role-based permissions matrix
 * - Provide permission checks via computed signals
 * - Handle permission grant/revoke
 *
 * Event Integration:
 * - Reacts to: WorkspaceSwitched (load permissions)
 * - Publishes: PermissionChanged, RoleCreated, RoleUpdated, RoleDeleted
 *
 * Clean Architecture Compliance:
 * - Single source of truth for permissions
 * - All checks via computed signals (no function calls)
 * - No RxJS subscriptions
 * - Pure signal-based reactivity
 *
 * IMPORTANT: Permissions are COMPUTED-ONLY, never mutated by business logic
 */

import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';

export interface Permission {
  readonly resource: string;
  readonly action: 'read' | 'create' | 'update' | 'delete' | 'admin';
}

export interface RolePermissions {
  readonly roleId: string;
  readonly roleName: string;
  readonly permissions: ReadonlyArray<Permission>;
}

export interface PermissionsState {
  readonly roles: ReadonlyArray<RolePermissions>;
  readonly currentUserRoleId: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: PermissionsState = {
  roles: [],
  currentUserRoleId: null,
  isLoading: false,
  error: null,
};

/**
 * Permissions Store
 *
 * Application-level store for RBAC permissions using NgRx Signals.
 * All permission checks are COMPUTED signals.
 */
export const PermissionsStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Current user's role
     */
    currentUserRole: computed(() => {
      const roleId = state.currentUserRoleId();
      return roleId ? state.roles().find(r => r.roleId === roleId) || null : null;
    }),

    /**
     * Current user's permissions
     */
    currentUserPermissions: computed(() => {
      const roleId = state.currentUserRoleId();
      const role = state.roles().find(r => r.roleId === roleId);
      return role?.permissions || [];
    }),

    /**
     * Check if current user can perform action on resource
     * Returns a computed signal factory
     */
    canPerform: computed(() => (resource: string, action: Permission['action']) => {
      const roleId = state.currentUserRoleId();
      if (!roleId) return false;

      const role = state.roles().find(r => r.roleId === roleId);
      if (!role) return false;

      return role.permissions.some(p => 
        p.resource === resource && (p.action === action || p.action === 'admin')
      );
    }),

    /**
     * Get permissions for role
     */
    getPermissionsForRole: computed(() => (roleId: string) => {
      const role = state.roles().find(r => r.roleId === roleId);
      return role?.permissions || [];
    }),

    /**
     * Has any roles
     */
    hasRoles: computed(() => state.roles().length > 0),
  })),

  withMethods((store) => {
    // Note: eventBus injection would go here if we had access to it
    // For now, keeping minimal changes - event bus can be injected by consumers
    
    return {
      /**
       * Set roles and permissions
       */
      setRoles(roles: RolePermissions[]): void {
        patchState(store, { roles });
      },

      /**
       * Set current user role
       */
      setCurrentUserRole(roleId: string | null): void {
        patchState(store, { currentUserRoleId: roleId });
      },

      /**
       * Grant permission to role (with event publishing)
       */
      grantPermission(roleId: string, permission: Permission, eventBus?: IModuleEventBus): void {
        patchState(store, {
          roles: store.roles().map(role =>
            role.roleId === roleId
              ? { ...role, permissions: [...role.permissions, permission] }
              : role
          ),
        });

        // Publish event if eventBus provided
        if (eventBus) {
          eventBus.publish({
            type: 'PermissionChanged',
            payload: {
              roleId,
              permission: `${permission.resource}:${permission.action}`,
              action: 'grant',
              correlationId: crypto.randomUUID(),
            },
            timestamp: Date.now(),
          });
        }
      },

      /**
       * Revoke permission from role (with event publishing)
       */
      revokePermission(
        roleId: string,
        resource: string,
        action: Permission['action'],
        eventBus?: IModuleEventBus
      ): void {
        patchState(store, {
          roles: store.roles().map(role =>
            role.roleId === roleId
              ? {
                  ...role,
                  permissions: role.permissions.filter(
                    p => !(p.resource === resource && p.action === action)
                  ),
                }
              : role
          ),
        });

        // Publish event if eventBus provided
        if (eventBus) {
          eventBus.publish({
            type: 'PermissionChanged',
            payload: {
              roleId,
              permission: `${resource}:${action}`,
              action: 'revoke',
              correlationId: crypto.randomUUID(),
            },
            timestamp: Date.now(),
          });
        }
      },

      /**
       * Reset (Clear on Workspace Switch)
       */
      reset(): void {
        patchState(store, initialState);
      },

      /**
       * Clear all permissions (workspace switch)
       * @deprecated Use reset() instead
       */
      clearPermissions(): void {
        this.reset();
      },

      /**
       * Set loading
       */
      setLoading(isLoading: boolean): void {
        patchState(store, { isLoading });
      },

      /**
       * Set error
       */
      setError(error: string | null): void {
        patchState(store, { error, isLoading: false });
      },

      /**
       * Add new role
       */
      addRole(role: RolePermissions, eventBus?: IModuleEventBus): void {
        patchState(store, {
          roles: [...store.roles(), role],
        });

        // Publish RoleCreated event
        if (eventBus) {
          eventBus.publish({
            type: 'RoleCreated',
            payload: {
              roleId: role.roleId,
              roleName: role.roleName,
              permissions: role.permissions.map(p => `${p.resource}:${p.action}`),
              correlationId: crypto.randomUUID(),
            },
            timestamp: Date.now(),
          });
        }
      },

      /**
       * Delete role
       */
      deleteRole(roleId: string, eventBus?: IModuleEventBus): void {
        const role = store.roles().find(r => r.roleId === roleId);
        
        patchState(store, {
          roles: store.roles().filter(r => r.roleId !== roleId),
        });

        // Publish RoleDeleted event
        if (eventBus && role) {
          eventBus.publish({
            type: 'RoleDeleted',
            payload: {
              roleId,
              roleName: role.roleName,
              correlationId: crypto.randomUUID(),
            },
            timestamp: Date.now(),
          });
        }
      },
    };
  })
);
