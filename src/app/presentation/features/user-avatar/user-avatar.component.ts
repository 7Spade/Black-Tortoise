import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

/**
 * UserAvatarComponent
 *
 * Presentation component with dropdown menu for user actions.
 * Design principles:
 * - Only display-related UI & local state (using Signals), no business logic.
 * - Does not directly call infrastructure or repository; data provided by Application layer.
 * - Uses standalone component (Angular modern convention) with OnPush for performance.
 * - Includes menu for Settings and Profile navigation (emits actions to parent).
 */
@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent {
  // Local signal for the avatar URL
  avatarUrl = signal<string | null>(null);
  
  // Local UI state for menu visibility
  showMenu = signal(false);
  
  // Output event for menu item clicks
  readonly menuItemClicked = output<string>();

  toggleMenu(): void {
    this.showMenu.update(v => !v);
  }
  
  closeMenu(): void {
    this.showMenu.set(false);
  }
  
  onMenuItemClick(action: string): void {
    this.menuItemClicked.emit(action);
    this.closeMenu();
  }
}
