/**
 * Permission Matrix Component
 * 
 * Layer: Presentation
 * Purpose: 2D matrix showing roles vs permissions with checkboxes
 * 
 * Features:
 * - Sticky headers for navigation
 * - Material checkboxes for permission toggles
 * - Optimistic updates
 * - OnPush change detection
 */

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PermissionsStore, Permission } from '@application/stores/permissions.store';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';

@Component({
  selector: 'app-permission-matrix',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './permission-matrix.component.html',
  styleUrl: './permission-matrix.component.scss',
})
export class PermissionMatrixComponent {
  readonly store = inject(PermissionsStore);
  readonly eventBus = input<IModuleEventBus | undefined>();

  /**
   * Available resources and actions for matrix columns
   */
  readonly resources = ['tasks', 'qc', 'code', 'bugs', 'reports'];
  readonly actions: Permission['action'][] = ['read', 'create', 'update', 'delete', 'admin'];

  /**
   * Matrix columns: role name + resource:action combinations
   */
  readonly displayedColumns = computed(() => [
    'roleName',
    ...this.resources.flatMap(resource =>
      this.actions.map(action => `${resource}:${action}`)
    ),
  ]);

  /**
   * Check if role has specific permission
   */
  hasPermission(roleId: string, resource: string, action: Permission['action']): boolean {
    const permissions = this.store.getPermissionsForRole()(roleId);
    return permissions.some(p => p.resource === resource && p.action === action);
  }

  /**
   * Toggle permission (optimistic update)
   */
  togglePermission(roleId: string, resource: string, action: Permission['action']): void {
    const hasIt = this.hasPermission(roleId, resource, action);
    const eventBusInstance = this.eventBus();

    if (hasIt) {
      this.store.revokePermission(roleId, resource, action, eventBusInstance);
    } else {
      this.store.grantPermission(roleId, { resource, action }, eventBusInstance);
    }
  }

  /**
   * Check if role is system role (cannot be modified)
   */
  isSystemRole(roleId: string): boolean {
    return ['owner', 'admin', 'member', 'viewer'].includes(roleId.toLowerCase());
  }
}
