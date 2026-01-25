/**
 * Members Store
 *
 * Layer: Application - Store
 * Purpose: Manages workspace members state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+, NO RxJS
 *
 * Responsibilities:
 * - Track workspace members
 * - Manage member invitations
 * - Handle member role assignments
 *
 * Event Integration:
 * - Reacts to: WorkspaceSwitched
 * - Publishes: MemberInvited, MemberRemoved
 *
 * Clean Architecture Compliance:
 * - Single source of truth for members state
 * - All state updates via patchState
 * - No RxJS subscriptions
 * - Pure signal-based reactivity
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface Member {
  readonly id: string;
  readonly userId: string;
  readonly email: string;
  readonly displayName: string;
  readonly roleId: string;
  readonly joinedAt: Date;
  readonly status: 'active' | 'inactive' | 'pending';
}

export interface MemberInvitation {
  readonly id: string;
  readonly email: string;
  readonly roleId: string;
  readonly invitedBy: string;
  readonly invitedAt: Date;
  readonly expiresAt: Date;
  readonly status: 'pending' | 'accepted' | 'expired' | 'revoked';
}

export interface MembersState {
  readonly members: ReadonlyArray<Member>;
  readonly invitations: ReadonlyArray<MemberInvitation>;
  readonly selectedMemberId: string | null;
  readonly isProcessing: boolean;
  readonly error: string | null;
}

const initialState: MembersState = {
  members: [],
  invitations: [],
  selectedMemberId: null,
  isProcessing: false,
  error: null,
};

/**
 * Members Store
 *
 * Application-level store for workspace member management using NgRx Signals.
 */
export const MembersStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Active members
     */
    activeMembers: computed(() =>
      state.members().filter(m => m.status === 'active')
    ),

    /**
     * Pending invitations
     */
    pendingInvitations: computed(() =>
      state.invitations().filter(i => i.status === 'pending')
    ),

    /**
     * Selected member
     */
    selectedMember: computed(() => {
      const id = state.selectedMemberId();
      return id ? state.members().find(m => m.id === id) || null : null;
    }),

    /**
     * Members by role
     */
    getMembersByRole: computed(() => (roleId: string) =>
      state.members().filter(m => m.roleId === roleId)
    ),

    /**
     * Total member count
     */
    totalMembers: computed(() => state.members().length),

    /**
     * Has members
     */
    hasMembers: computed(() => state.members().length > 0),
  })),

  withMethods((store) => ({
    /**
     * Add member
     */
    addMember(member: Omit<Member, 'id' | 'joinedAt' | 'status'>): void {
      const newMember: Member = {
        ...member,
        id: crypto.randomUUID(),
        joinedAt: new Date(),
        status: 'active',
      };

      patchState(store, {
        members: [...store.members(), newMember],
      });
    },

    /**
     * Remove member
     */
    removeMember(memberId: string): void {
      patchState(store, {
        members: store.members().filter(m => m.id !== memberId),
      });
    },

    /**
     * Update member role
     */
    updateMemberRole(memberId: string, roleId: string): void {
      patchState(store, {
        members: store.members().map(m =>
          m.id === memberId ? { ...m, roleId } : m
        ),
      });
    },

    /**
     * Create invitation
     */
    createInvitation(invitation: Omit<MemberInvitation, 'id' | 'invitedAt' | 'expiresAt' | 'status'>): void {
      const newInvitation: MemberInvitation = {
        ...invitation,
        id: crypto.randomUUID(),
        invitedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: 'pending',
      };

      patchState(store, {
        invitations: [...store.invitations(), newInvitation],
      });
    },

    /**
     * Accept invitation
     */
    acceptInvitation(invitationId: string): void {
      patchState(store, {
        invitations: store.invitations().map(i =>
          i.id === invitationId ? { ...i, status: 'accepted' as const } : i
        ),
      });
    },

    /**
     * Revoke invitation
     */
    revokeInvitation(invitationId: string): void {
      patchState(store, {
        invitations: store.invitations().map(i =>
          i.id === invitationId ? { ...i, status: 'revoked' as const } : i
        ),
      });
    },

    /**
     * Select member
     */
    selectMember(memberId: string | null): void {
      patchState(store, { selectedMemberId: memberId });
    },

    /**
     * Clear all members (workspace switch)
     */
    clearMembers(): void {
      patchState(store, {
        members: [],
        invitations: [],
        selectedMemberId: null,
        isProcessing: false,
        error: null,
      });
    },

    /**
     * Set error
     */
    setError(error: string | null): void {
      patchState(store, { error, isProcessing: false });
    },
  }))
);
