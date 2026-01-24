/**
 * Members Store
 *
 * Layer: Application - Store
 * Purpose: Manages workspace member state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Member roster management
 * - Role assignments
 * - Member activity tracking
 *
 * Event Flow:
 * - Publishes: MemberAdded, MemberRemoved
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

import { EventBus } from '@domain/event-bus/event-bus.interface';
import { EventStore } from '@domain/event-store/event-store.interface';
import { createMemberAddedEvent, createMemberRemovedEvent } from '@domain/events/domain-events';

export interface Member {
  readonly memberId: string;
  readonly email: string;
  readonly displayName: string;
  readonly roleIds: string[];
  readonly status: 'active' | 'inactive' | 'pending';
  readonly addedAt: Date;
  readonly addedById: string;
  readonly lastActiveAt?: Date;
}

export interface MembersState {
  readonly members: ReadonlyArray<Member>;
  readonly selectedMember: Member | null;
  readonly searchQuery: string;
  readonly filterRole: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: MembersState = {
  members: [],
  selectedMember: null,
  searchQuery: '',
  filterRole: null,
  isLoading: false,
  error: null,
};

export const MembersStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    filteredMembers: computed(() => {
      let members = state.members();
      
      const query = state.searchQuery().toLowerCase();
      if (query) {
        members = members.filter(m =>
          m.displayName.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query)
        );
      }
      
      const roleFilter = state.filterRole();
      if (roleFilter) {
        members = members.filter(m => m.roleIds.includes(roleFilter));
      }
      
      return members;
    }),
    
    activeMembers: computed(() =>
      state.members().filter(m => m.status === 'active')
    ),
    
    pendingMembers: computed(() =>
      state.members().filter(m => m.status === 'pending')
    ),
    
    membersByRole: computed(() => (roleId: string) =>
      state.members().filter(m => m.roleIds.includes(roleId))
    ),
    
    totalMembers: computed(() => state.members().length),
    
    activeMemberCount: computed(() =>
      state.members().filter(m => m.status === 'active').length
    ),
  })),

  withMethods((store) => ({
    /**
     * Add member
     */
    addMember: rxMethod<{
      email: string;
      displayName: string;
      roleIds: string[];
      addedById: string;
      workspaceId: string;
      eventBus: EventBus;
      eventStore: EventStore;
    }>(
      pipe(
        tap(({ email, displayName, roleIds, addedById, workspaceId, eventBus, eventStore }) => {
          const memberId = crypto.randomUUID();
          
          const newMember: Member = {
            memberId,
            email,
            displayName,
            roleIds,
            status: 'pending',
            addedAt: new Date(),
            addedById,
          };
          
          // Create and publish event
          const event = createMemberAddedEvent(
            memberId,
            workspaceId,
            email,
            displayName,
            roleIds,
            addedById
          );
          
          // Append then publish
          eventStore.append(event).then(() => {
            eventBus.publish(event);
          });
          
          // Update state
          patchState(store, {
            members: [...store.members(), newMember],
            error: null,
          });
        })
      )
    ),

    /**
     * Remove member
     */
    removeMember: rxMethod<{
      memberId: string;
      removedById: string;
      reason?: string;
      workspaceId: string;
      eventBus: EventBus;
      eventStore: EventStore;
    }>(
      pipe(
        tap(({ memberId, removedById, reason, workspaceId, eventBus, eventStore }) => {
          const members = store.members();
          const member = members.find(m => m.memberId === memberId);
          
          if (!member) {
            patchState(store, { error: `Member ${memberId} not found` });
            return;
          }
          
          // Create and publish event
          const event = createMemberRemovedEvent(
            memberId,
            workspaceId,
            removedById,
            reason
          );
          
          // Append then publish
          eventStore.append(event).then(() => {
            eventBus.publish(event);
          });
          
          // Update state
          patchState(store, {
            members: members.filter(m => m.memberId !== memberId),
            error: null,
          });
        })
      )
    ),

    /**
     * Update member roles
     */
    updateMemberRoles(memberId: string, roleIds: string[]): void {
      const members = store.members();
      const member = members.find(m => m.memberId === memberId);
      
      if (!member) {
        patchState(store, { error: `Member ${memberId} not found` });
        return;
      }
      
      const updatedMember: Member = { ...member, roleIds };
      
      patchState(store, {
        members: members.map(m => m.memberId === memberId ? updatedMember : m),
        error: null,
      });
    },

    /**
     * Update member status
     */
    updateMemberStatus(memberId: string, status: 'active' | 'inactive' | 'pending'): void {
      const members = store.members();
      const member = members.find(m => m.memberId === memberId);
      
      if (!member) {
        patchState(store, { error: `Member ${memberId} not found` });
        return;
      }
      
      const updatedMember: Member = { ...member, status };
      
      patchState(store, {
        members: members.map(m => m.memberId === memberId ? updatedMember : m),
        error: null,
      });
    },

    /**
     * Update last active time
     */
    updateLastActive(memberId: string): void {
      const members = store.members();
      const member = members.find(m => m.memberId === memberId);
      
      if (member) {
        const updatedMember: Member = { ...member, lastActiveAt: new Date() };
        patchState(store, {
          members: members.map(m => m.memberId === memberId ? updatedMember : m),
        });
      }
    },

    /**
     * Set search query
     */
    setSearchQuery(query: string): void {
      patchState(store, { searchQuery: query });
    },

    /**
     * Set role filter
     */
    setRoleFilter(roleId: string | null): void {
      patchState(store, { filterRole: roleId });
    },

    /**
     * Select member
     */
    selectMember(memberId: string): void {
      const member = store.members().find(m => m.memberId === memberId);
      patchState(store, { selectedMember: member || null });
    },

    /**
     * Clear selection
     */
    clearSelection(): void {
      patchState(store, { selectedMember: null });
    },

    /**
     * Load members
     */
    loadMembers(members: Member[]): void {
      patchState(store, { members, error: null });
    },

    /**
     * Reset store (on workspace switch)
     */
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
