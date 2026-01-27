/**
 * Permissions Module - RBAC Management
 * Layer: Presentation
 * All permission checks via COMPUTED signals only
 */

import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { PermissionsStore } from '@application/stores/permissions.store';
import { ModuleEventHelper } from '@presentation/components/module-event-helper';
import { PermissionMatrixComponent } from '@presentation/components/permission-matrix/permission-matrix.component';

@Component({
  selector: 'app-permissions-module',
  standalone: true,
  imports: [PermissionMatrixComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="permissions-module">
      <div class="module-header">
        <h2>🔐 Permissions Management</h2>
        <p class="workspace-info">Workspace: {{ eventBus?.workspaceId }}</p>
      </div>

      <div class="permissions-content">
        <h3>Role Permission Matrix</h3>
        <app-permission-matrix [eventBus]="eventBus" />
      </div>

      @if (!permissionsStore.hasRoles()) {
        <div class="empty-state">
          <p>No roles configured for this workspace</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements IAppModule, OnInit, OnDestroy {
  readonly id = 'permissions';
  readonly name = 'Permissions';
  readonly type: ModuleType = 'permissions';

  @Input() eventBus: IModuleEventBus | undefined;
  readonly permissionsStore = inject(PermissionsStore);

  private subscriptions = ModuleEventHelper.createSubscriptionManager();

  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }

  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;

    // Initialize with demo roles
    this.permissionsStore.setRoles([
      {
        roleId: 'owner',
        roleName: 'Owner',
        permissions: [
          { resource: 'tasks', action: 'admin' },
          { resource: 'qc', action: 'admin' },
          { resource: 'code', action: 'admin' },
          { resource: 'bugs', action: 'admin' },
          { resource: 'reports', action: 'admin' },
        ],
      },
      {
        roleId: 'admin',
        roleName: 'Administrator',
        permissions: [
          { resource: 'tasks', action: 'admin' },
          { resource: 'qc', action: 'admin' },
          { resource: 'bugs', action: 'admin' },
        ],
      },
      {
        roleId: 'member',
        roleName: 'Member',
        permissions: [
          { resource: 'tasks', action: 'create' },
          { resource: 'tasks', action: 'read' },
          { resource: 'tasks', action: 'update' },
          { resource: 'qc', action: 'create' },
          { resource: 'qc', action: 'read' },
        ],
      },
      {
        roleId: 'viewer',
        roleName: 'Viewer',
        permissions: [
          { resource: 'tasks', action: 'read' },
          { resource: 'reports', action: 'read' },
        ],
      },
    ]);

    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.permissionsStore.clearPermissions();
      }),
    );
  }

  activate(): void {}
  deactivate(): void {}
  destroy(): void {
    this.subscriptions.unsubscribeAll();
  }
  ngOnDestroy(): void {
    this.destroy();
  }
}
