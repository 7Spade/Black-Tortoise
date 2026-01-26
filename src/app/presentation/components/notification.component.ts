import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationFacade } from '@application/facades/notification.facade';
import { NotificationItem, PresentationStore } from '@application/stores/presentation.store';

/**
 * NotificationComponent
 * 
 * Layer: Presentation - Shared Component
 * Purpose: Pure UI component for notification list - no state ownership, no business logic
 * Architecture: Zone-less, Pure Reactive, Signals as single source of truth
 * 
 * DDD Compliance:
 * - Presentation consumes state from Application layer (PresentationStore)
 * - Forwards all user events to Application facade (NotificationFacade)
 * - No local state ownership (removed notifications signal)
 * - No business logic (no filtering, no mutation)
 * 
 * Control Flow:
 * 1. User clicks dismiss → facade.dismissNotification()
 * 2. User clicks notification → facade.handleNotificationClick()
 * 3. Facade updates PresentationStore
 * 4. Component reads notifications() signal from store
 * 5. Template binds to store signals (single source of truth)
 */
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<!-- NotificationComponent（Presentation, Shared） -->
<!-- Pure UI: Consumes state from PresentationStore, forwards events to NotificationFacade -->
<!-- No local state, no business logic - fully reactive control flow -->
<!-- Architecture: Angular 20 control flow (@for instead of *ngFor) -->
<ul class="notification">
  @for (n of store.notifications(); track n.id) {
    <li 
      class="notification__item" 
      [class.notification__item--unread]="!n.read"
      [attr.data-type]="n.type"
      (click)="onClick(n)"
    >
      <div class="notification__content">
        <strong class="notification__type">{{ n.type }}</strong>
        <div class="notification__text">
          <span class="notification__title">{{ n.title }}</span>
          <span class="notification__message">{{ n.message }}</span>
        </div>
        <span class="notification__timestamp">{{ n.timestamp | date:'short' }}</span>
      </div>
      <button 
        class="notification__dismiss" 
        (click)="dismiss(n.id); $event.stopPropagation()" 
        type="button"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </li>
  } @empty {
    <li class="notification__empty">
      No notifications
    </li>
  }
</ul>

@if (store.hasNotifications()) {
  <div class="notification__footer">
    <span class="notification__count">
      {{ store.unreadNotificationsCount() }} unread
    </span>
  </div>
}
  `,
  styles: [`
/**
 * Notification Component Styles
 * 
 * Layer: Presentation
 * Purpose: Themeable notification list styles using Material Design 3 tokens
 * 
 * Design System Compliance:
 * - Uses CSS custom properties from m3-tokens.scss
 * - Supports light/dark theme via --md-sys-color-* tokens
 * - No hardcoded colors - all from design system
 * - Type-specific styling (info, success, warning, error)
 * - Responsive spacing and elevation
 */

.notification {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--md-sys-spacing-sm);
  
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: var(--md-sys-spacing-md);
    border-radius: var(--md-sys-shape-corner-md);
    background-color: var(--md-sys-color-surface-variant);
    border: 1px solid var(--md-sys-color-outline-variant);
    cursor: pointer;
    transition: all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
    
    &:hover {
      background-color: var(--md-sys-color-surface-variant);
      border-color: var(--md-sys-color-outline);
      box-shadow: var(--md-sys-elevation-level1);
    }
    
    &--unread {
      background-color: var(--md-sys-color-primary-container);
      border-color: var(--md-sys-color-primary);
      border-left-width: 3px;
    }
    
    // Type-specific styling using data attributes
    &[data-type="info"] {
      border-left-color: var(--md-sys-color-primary);
    }
    
    &[data-type="success"] {
      border-left-color: var(--md-sys-color-tertiary);
    }
    
    &[data-type="warning"] {
      border-left-color: var(--md-sys-color-secondary);
    }
    
    &[data-type="error"] {
      border-left-color: var(--md-sys-color-error);
    }
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--md-sys-spacing-xs);
    flex: 1;
  }
  
  &__type {
    font-size: var(--md-sys-typescale-label-small-font-size);
    font-weight: var(--md-sys-typescale-label-small-font-weight);
    color: var(--md-sys-color-on-surface-variant);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  &__text {
    display: flex;
    flex-direction: column;
    gap: var(--md-sys-spacing-xs);
    flex: 1;
  }
  
  &__title {
    font-size: var(--md-sys-typescale-title-medium-font-size);
    font-weight: var(--md-sys-typescale-title-medium-font-weight);
    color: var(--md-sys-color-on-surface);
  }
  
  &__message {
    font-size: var(--md-sys-typescale-body-medium-font-size);
    color: var(--md-sys-color-on-surface-variant);
    line-height: var(--md-sys-typescale-body-medium-line-height);
  }
  
  &__timestamp {
    font-size: var(--md-sys-typescale-label-small-font-size);
    color: var(--md-sys-color-on-surface-variant);
    opacity: 0.7;
  }
  
  &__dismiss {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: var(--md-sys-spacing-xs);
    color: var(--md-sys-color-on-surface-variant);
    font-size: 1.25rem;
    line-height: 1;
    border-radius: var(--md-sys-shape-corner-sm);
    transition: all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
    
    &:hover {
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
    }
    
    &:active {
      opacity: 0.8;
    }
  }
  
  &__empty {
    padding: var(--md-sys-spacing-lg);
    text-align: center;
    color: var(--md-sys-color-on-surface-variant);
    font-size: var(--md-sys-typescale-body-large-font-size);
    font-style: italic;
  }
  
  &__footer {
    display: flex;
    justify-content: center;
    padding: var(--md-sys-spacing-sm) 0;
    border-top: 1px solid var(--md-sys-color-outline-variant);
    margin-top: var(--md-sys-spacing-sm);
  }
  
  &__count {
    font-size: var(--md-sys-typescale-label-medium-font-size);
    font-weight: var(--md-sys-typescale-label-medium-font-weight);
    color: var(--md-sys-color-primary);
  }
}
  `]
})
export class NotificationComponent {
  // Application layer dependencies
  private readonly facade = inject(NotificationFacade);
  protected readonly store = inject(PresentationStore);

  /**
   * Handle notification dismissal - forward to facade
   */
  dismiss(id: string): void {
    this.facade.dismissNotification(id);
  }

  /**
   * Handle notification click - forward to facade
   */
  onClick(notification: NotificationItem): void {
    this.facade.handleNotificationClick(notification);
  }
}

