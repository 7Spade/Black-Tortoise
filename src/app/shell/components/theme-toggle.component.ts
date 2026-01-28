import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { SettingsFacade } from '@application/facades/settings.facade';

/**
 * ThemeToggleComponent
 * - Shell UI shared component: Toggle application theme (light / dark)
 * - Architecture: Zone-less, OnPush, Angular 20, Signal-based
 * - Persists theme preference via SettingsFacade
 * - Global theme application is handled via effect reacting to Facade state
 */
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="icon-button theme-toggle"
      aria-label="Toggle theme"
      type="button"
      (click)="facade.toggleTheme()"
    >
      <span class="material-icons">
        @if (facade.isDark()) {
          light_mode
        } @else {
          dark_mode
        }
      </span>
    </button>
  `,
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  readonly facade = inject(SettingsFacade);
  private readonly document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      const isDark = this.facade.isDark();
      const themeClass = isDark ? 'dark' : 'light';

      this.document.body.classList.remove('light', 'dark');
      this.document.body.classList.add(themeClass);
    });
  }
}