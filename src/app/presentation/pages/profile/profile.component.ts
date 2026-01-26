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
  templateUrl: './profile.component.html',
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
