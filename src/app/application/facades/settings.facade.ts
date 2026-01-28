import { computed, inject, Injectable } from '@angular/core';
import { SettingsStore } from '@settings/application/stores/settings.store';

@Injectable({ providedIn: 'root' })
export class SettingsFacade {
  private readonly store = inject(SettingsStore);

  /**
   * Current theme signal (from store)
   */
  readonly theme = this.store.currentTheme;

  /**
   * Is dark mode enabled (computed)
   */
  readonly isDark = computed(() => this.theme() === 'dark');

  /**
   * Toggle theme between light and dark
   */
  toggleTheme(): void {
    const currentTheme = this.theme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.store.updateUserPreferences({ theme: newTheme });
  }
}
