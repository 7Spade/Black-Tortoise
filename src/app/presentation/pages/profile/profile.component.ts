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
  styleUrls: ['./profile.component.scss'],
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
