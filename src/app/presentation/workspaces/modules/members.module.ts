/**
 * Members Module - Team Management
 * Layer: Presentation
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { MembersStore } from '@application/stores/members.store';
import { ModuleEventHelper } from '@presentation/workspaces/modules/basic/module-event-helper';

@Component({
  selector: 'app-members-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="members-module">
      <div class="module-header">
        <h2>👥 Members</h2>
        <p>Workspace: {{ eventBus?.workspaceId }} | Total: {{ membersStore.totalMembers() }}</p>
      </div>
      
      <div class="members-list">
        <h3>Active Members ({{ membersStore.activeMembers().length }})</h3>
        @for (member of membersStore.activeMembers(); track member.id) {
          <div class="member-card">
            <div class="member-avatar">{{ member.displayName[0] }}</div>
            <div class="member-info">
              <h4>{{ member.displayName }}</h4>
              <p>{{ member.email }} | Role: {{ member.roleId }}</p>
            </div>
          </div>
        }
        @if (!membersStore.hasMembers()) {
          <div class="empty-state">No members</div>
        }
      </div>

      <div class="invitations-section">
        <h3>Pending Invitations ({{ membersStore.pendingInvitations().length }})</h3>
        @for (invite of membersStore.pendingInvitations(); track invite.id) {
          <div class="invitation-card">
            <span>{{ invite.email }}</span>
            <span>{{ invite.roleId }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .members-module { padding: 1.5rem; max-width: 1000px; }
    .module-header h2 { margin: 0 0 0.5rem 0; color: #1976d2; }
    .members-list, .invitations-section { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
    .member-card, .invitation-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 0.5rem; }
    .member-avatar { width: 40px; height: 40px; border-radius: 50%; background: #1976d2; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .member-info h4 { margin: 0; }
    .member-info p { margin: 0.25rem 0 0 0; font-size: 0.75rem; color: #666; }
    .empty-state { text-align: center; color: #999; padding: 2rem; }
  `]
})
export class MembersModule implements IAppModule, OnInit, OnDestroy {
  readonly id = 'members';
  readonly name = 'Members';
  readonly type: ModuleType = 'members';
  
  @Input() eventBus: IModuleEventBus | undefined;
  readonly membersStore = inject(MembersStore);
  
  private subscriptions = ModuleEventHelper.createSubscriptionManager();
  
  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }
  
  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;
    
    // Initialize with demo member
    this.membersStore.addMember({
      userId: 'user-1',
      email: 'demo@example.com',
      displayName: 'Demo User',
      roleId: 'admin',
    });
    
    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.membersStore.clearMembers();
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
