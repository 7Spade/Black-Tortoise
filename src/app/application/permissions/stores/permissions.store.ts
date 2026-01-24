/**
 * Permissions Store
 *
 * Layer: Application - Store
 * Purpose: Manages RBAC permissions state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Role-based access control
 * - Permission matrix management
 * - Permission checks via computed signals
 *
 * Event Flow:
 * - Publishes: PermissionUpdated, RoleCreated
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

import { EventBus } from '@domain/event-bus/event-bus.interface';
import { EventStore } from '@domain/event-store/event-store.interface';
import { createPermissionUpdatedEvent, createRoleCreatedEvent } from '@domain/events/domain-events';

export interface Role {
  readonly roleId: string;
  readonly roleName: string;
  readonly description?: string;
  readonly permissions: Map<string, string[]>;
  readonly createdAt: Date;
}

export interface PermissionsState {
  readonly roles: ReadonlyArray<Role>;
  readonly currentUserId: string | null;
  readonly currentUserRoles: string[];
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: PermissionsState = {
  roles: [],
  currentUserId: null,
  currentUserRoles: [],
  isLoading: false,
  error: null,
};

export const PermissionsStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * All available resources
     */
    allResources: computed(() => {
      const resources = new Set<string>();
      state.roles().forEach(role => {
        role.permissions.forEach((_, resource) => {
          resources.add(resource);
        });
      });
      return Array.from(resources).sort();
    }),
    
    /**
     * Current user permissions
     */
    currentUserPermissions: computed(() => {
      const userRoles = state.currentUserRoles();
      const roles = state.roles().filter(role => userRoles.includes(role.roleId));
      
      const permissions = new Map<string, Set<string>>();
      roles.forEach(role => {
        role.permissions.forEach((perms, resource) => {
          if (!permissions.has(resource)) {
            permissions.set(resource, new Set());
          }
          perms.forEach(perm => permissions.get(resource)!.add(perm));
        });
      });
      
      return permissions;
    }),
    
    /**
     * Check if current user can perform action on resource
     */
    canPerform: computed(() => (resource: string, action: string) => {
      const permissions = state.roles()
        .filter(role => state.currentUserRoles().includes(role.roleId))
        .flatMap(role => role.permissions.get(resource) || []);
      
      return permissions.includes(action) || permissions.includes('*');
    }),
    
    /**
     * Can edit - common permission check
     */
    canEdit: computed(() => (resource: string) => {
      const permissions = state.roles()
        .filter(role => state.currentUserRoles().includes(role.roleId))
        .flatMap(role => role.permissions.get(resource) || []);
      
      return permissions.includes('edit') || permissions.includes('*');
    }),
    
    /**
     * Can delete - common permission check
     */
    canDelete: computed(() => (resource: string) => {
      const permissions = state.roles()
        .filter(role => state.currentUserRoles().includes(role.roleId))
        .flatMap(role => role.permissions.get(resource) || []);
      
      return permissions.includes('delete') || permissions.includes('*');
    }),
    
    /**
     * Can view - common permission check
     */
    canView: computed(() => (resource: string) => {
      const permissions = state.roles()
        .filter(role => state.currentUserRoles().includes(role.roleId))
        .flatMap(role => role.permissions.get(resource) || []);
      
      return permissions.includes('view') || permissions.includes('*');
    }),
  })),

  withMethods((store) => ({
    /**
     * Create role
     */
    createRole: rxMethod<{
      roleName: string;
      description?: string;
      createdById: string;
      workspaceId: string;
      eventBus: EventBus;
      eventStore: EventStore;
    }>(
      pipe(
        tap(({ roleName, description, createdById, workspaceId, eventBus, eventStore }) => {
          const roleId = crypto.randomUUID();
          
          const newRole: Role = {
            roleId,
            roleName,
            description,
            permissions: new Map(),
            createdAt: new Date(),
          };
          
          // Create and publish event
          const event = createRoleCreatedEvent(
            roleId,
            workspaceId,
            roleName,
            createdById,
            description
          );
          
          // Append then publish
          eventStore.append(event).then(() => {
            eventBus.publish(event);
          });
          
          // Update state
          patchState(store, {
            roles: [...store.roles(), newRole],
            error: null,
          });
        })
      )
    ),

    /**
     * Update role permissions
     */
    updatePermissions: rxMethod<{
      roleId: string;
      resource: string;
      permissions: string[];
      updatedById: string;
      workspaceId: string;
      eventBus: EventBus;
      eventStore: EventStore;
    }>(
      pipe(
        tap(({ roleId, resource, permissions, updatedById, workspaceId, eventBus, eventStore }) => {
          const roles = store.roles();
          const role = roles.find(r => r.roleId === roleId);
          
          if (!role) {
            patchState(store, { error: `Role ${roleId} not found` });
            return;
          }
          
          const updatedPermissions = new Map(role.permissions);
          updatedPermissions.set(resource, permissions);
          
          const updatedRole: Role = {
            ...role,
            permissions: updatedPermissions,
          };
          
          // Create and publish event
          const event = createPermissionUpdatedEvent(
            roleId,
            workspaceId,
            role.roleName,
            resource,
            permissions,
            updatedById
          );
          
          // Append then publish
          eventStore.append(event).then(() => {
            eventBus.publish(event);
          });
          
          // Update state
          patchState(store, {
            roles: roles.map(r => r.roleId === roleId ? updatedRole : r),
            error: null,
          });
        })
      )
    ),

    /**
     * Set current user context
     */
    setCurrentUser(userId: string, roleIds: string[]): void {
      patchState(store, {
        currentUserId: userId,
        currentUserRoles: roleIds,
        error: null,
      });
    },

    /**
     * Load roles
     */
    loadRoles(roles: Role[]): void {
      patchState(store, { roles, error: null });
    },

    /**
     * Reset store (on workspace switch)
     */
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
