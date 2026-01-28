/**
 * Members Module - Team Management
 * Layer: Presentation
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
import { FormsModule } from '@angular/forms';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { MembersStore } from '@application/stores/members.store';
import { ModuleEventHelper } from '@presentation/components/module-event-helper';

@Component({
  selector: 'app-members-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="members-module">
      <div class="module-header">
        <h2>👥 Members</h2>
        <p>
          Workspace: {{ eventBus?.workspaceId }} | Total:
          {{ membersStore.totalMembers() }}
        </p>
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
        <h3>
          Pending Invitations ({{ membersStore.pendingInvitations().length }})
        </h3>
        @for (invite of membersStore.pendingInvitations(); track invite.id) {
          <div class="invitation-card">
            <span>{{ invite.email }}</span>
            <span>{{ invite.roleId }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements IAppModule, OnInit, OnDestroy {
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
