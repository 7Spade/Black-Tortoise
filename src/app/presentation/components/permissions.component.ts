/**
 * Permissions Module - RBAC Management
 * Layer: Presentation
 * All permission checks via COMPUTED signals only
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
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
                  @for (perm of role.permissions; track perm.resource + perm.action) {
                    <span class="permission-badge">{{ perm.resource }}:{{ perm.action }}</span>
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
  styles: [`
    .permissions-module { padding: 1.5rem; max-width: 1200px; }
    .module-header h2 { margin: 0 0 0.5rem 0; color: #1976d2; }
    .permissions-matrix { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
    .matrix-table { width: 100%; border-collapse: collapse; }
    .matrix-table th { text-align: left; padding: 0.75rem; border-bottom: 2px solid #e0e0e0; }
    .matrix-table td { padding: 0.75rem; border-bottom: 1px solid #e0e0e0; }
    .permission-badge { display: inline-block; padding: 0.25rem 0.5rem; margin: 0.25rem; background: #e3f2fd; color: #1976d2; border-radius: 4px; font-size: 0.75rem; }
    .empty-state { text-align: center; color: #999; padding: 2rem; }
  `]
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
      })
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
