/**
 * Presentation Store
 *
 * Layer: Application - Store
 * Purpose: Manages global presentation/UI state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Global UI state (notifications, search, theme, etc.)
 * - Application-wide presentation signals and computed values
 * - No business logic - pure UI state management
 * - Used by both Application facades and Presentation components
 * 
 * Clean Architecture Compliance:
 * - Moved from Presentation to Application layer
 * - Manages cross-cutting UI concerns at application level
 * - Can be injected by facades without violating boundaries
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface PresentationState {
  readonly notifications: ReadonlyArray<NotificationItem>;
  readonly searchQuery: string;
  readonly isSearchActive: boolean;
  readonly theme: 'light' | 'dark' | 'auto';
  readonly sidebarCollapsed: boolean;
  readonly loadingStates: Record<string, boolean>;
}

export interface NotificationItem {
  readonly id: string;
  readonly type: 'info' | 'success' | 'warning' | 'error';
  readonly title: string;
  readonly message: string;
  readonly timestamp: Date;
  readonly read: boolean;
  readonly actionUrl?: string;
}

const initialState: PresentationState = {
  notifications: [],
  searchQuery: '',
  isSearchActive: false,
  theme: 'auto',
  sidebarCollapsed: false,
  loadingStates: {},
};

/**
 * Presentation Store
 *
 * Global store for presentation-layer state management.
 * Manages UI-specific state that doesn't belong in application stores.
 */
export const PresentationStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Unread notifications count
     */
    unreadNotificationsCount: computed(() =>
      state.notifications().filter(n => !n.read).length
    ),

    /**
     * Has any notifications
     */
    hasNotifications: computed(() =>
      state.notifications().length > 0
    ),

    /**
     * Has unread notifications
     */
    hasUnreadNotifications: computed(() =>
      state.notifications().filter(n => !n.read).length > 0
    ),

    /**
     * Current search query trimmed
     */
    trimmedSearchQuery: computed(() =>
      state.searchQuery().trim()
    ),

    /**
     * Is search query valid (non-empty after trim)
     */
    isSearchQueryValid: computed(() =>
      state.searchQuery().trim().length > 0
    ),

    /**
     * Any loading states active
     */
    isAnyLoading: computed(() =>
      Object.values(state.loadingStates()).some(loading => loading)
    ),
  })),

  withMethods((store) => ({
    /**
     * Add notification
     */
    addNotification(notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void {
      const newNotification: NotificationItem = {
        ...notification,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        read: false,
      };

      patchState(store, {
        notifications: [...store.notifications(), newNotification],
      });
    },

    /**
     * Remove notification
     */
    removeNotification(notificationId: string): void {
      patchState(store, {
        notifications: store.notifications().filter(n => n.id !== notificationId),
      });
    },

    /**
     * Mark notification as read
     */
    markNotificationRead(notificationId: string): void {
      patchState(store, {
        notifications: store.notifications().map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      });
    },

    /**
     * Mark all notifications as read
     */
    markAllNotificationsRead(): void {
      patchState(store, {
        notifications: store.notifications().map(n => ({ ...n, read: true })),
      });
    },

    /**
     * Clear all notifications
     */
    clearAllNotifications(): void {
      patchState(store, { notifications: [] });
    },

    /**
     * Set search query
     */
    setSearchQuery(query: string): void {
      patchState(store, { searchQuery: query });
    },

    /**
     * Set search active state
     */
    setSearchActive(active: boolean): void {
      patchState(store, { isSearchActive: active });
    },

    /**
     * Set theme
     */
    setTheme(theme: 'light' | 'dark' | 'auto'): void {
      patchState(store, { theme });
    },

    /**
     * Set sidebar collapsed state
     */
    setSidebarCollapsed(collapsed: boolean): void {
      patchState(store, { sidebarCollapsed: collapsed });
    },

    /**
     * Set loading state for a specific key
     */
    setLoading(key: string, loading: boolean): void {
      patchState(store, {
        loadingStates: {
          ...store.loadingStates(),
          [key]: loading,
        },
      });
    },

    /**
     * Reset presentation state
     */
    reset(): void {
      patchState(store, {
        notifications: [],
        searchQuery: '',
        isSearchActive: false,
        loadingStates: {},
      });
    },
  }))
);
