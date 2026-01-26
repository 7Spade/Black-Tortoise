import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuthStore } from '@application/stores/auth.store';

/**
 * ProfileComponent
 * 
 * Layer: Presentation
 * Purpose: Display user profile information
 * Architecture: Zone-less, OnPush, Reactive Signals
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
<!-- Profile Display Component -->
<section class="profile">
  <h2 class="profile__title">Profile</h2>
  
  @if (userProfile(); as profile) {
    <div class="profile__content">
      @if (profile.photoUrl) {
         <img [src]="profile.photoUrl" alt="Avatar" class="profile__avatar">
      }
      <p class="profile__name">{{ profile.displayName }}</p>
      <p class="profile__email">{{ profile.email }}</p>
      <p class="profile__id">User ID: {{ profile.id }}</p>
    </div>
  } @else {
    <p class="profile__empty">No active user session found.</p>
  }
</section>
  `,
  styles: [`
/**
 * Profile Component Styles
 * Using M3 Design Tokens
 */

.profile {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.profile__title {
  margin-bottom: 2rem;
  color: var(--mat-sys-on-surface);
  font-family: var(--mat-sys-typescale-headline-small-font);
}

.profile__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border-radius: 1rem;
  background-color: var(--mat-sys-surface-container-low);
  border: 1px solid var(--mat-sys-outline-variant);
}

.profile__avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.profile__name {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--mat-sys-on-surface);
  margin: 0;
}

.profile__email {
  color: var(--mat-sys-on-surface-variant);
  margin: 0;
}

.profile__id {
  font-size: 0.8rem;
  color: var(--mat-sys-outline);
  margin-top: 1rem;
}

.profile__empty {
    text-align: center;
    color: var(--mat-sys-on-surface-variant);
}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private readonly authStore = inject(AuthStore);

  // ViewModel for the profile
  readonly userProfile = computed(() => {
    if (!this.authStore.isLoggedIn()) {
      return null;
    }
    
    return {
      id: this.authStore.currentUserId(),
      email: this.authStore.email(),
      displayName: this.authStore.displayName(),
      photoUrl: this.authStore.photoUrl()
    };
  });
}
