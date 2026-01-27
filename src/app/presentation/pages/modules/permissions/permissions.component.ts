/**
 * Permissions Module - RBAC Management
 * Layer: Presentation
 * All permission checks via COMPUTED signals only
 */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { PermissionsStore } from '@application/stores/permissions.store';
import { ModuleEventHelper } from '@presentation/components/module-event-helper';

@Component({
  selector: 'app-permissions-module',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="permissions-module">
      <div class="module-header">
        <h2>🔐 Permissions</h2>
        <p>Workspace: {{ eventBus?.workspaceId }}</p>
      </div>

      <div class="permissions-matrix">
        <h3>Roles & Permissions</h3>
        <table class="matrix-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            @for (role of permissionsStore.roles(); track role.roleId) {
              <tr>
                <td>{{ role.roleName }}</td>
                <td>
                  @for (
                    perm of role.permissions;
                    track perm.resource + perm.action
                  ) {
                    <span class="permission-badge"
                      >{{ perm.resource }}:{{ perm.action }}</span
                    >
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>

        @if (!permissionsStore.hasRoles()) {
          <div class="empty-state">No roles configured</div>
        }
      </div>
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
        roleId: 'admin',
        roleName: 'Administrator',
        permissions: [
          { resource: 'tasks', action: 'admin' },
          { resource: 'users', action: 'admin' },
        ],
      },
      {
        roleId: 'member',
        roleName: 'Member',
        permissions: [
          { resource: 'tasks', action: 'create' },
          { resource: 'tasks', action: 'read' },
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
