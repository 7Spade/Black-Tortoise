import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SettingsFacade } from '@application/facades/settings.facade';

/**
 * ThemeToggleComponent
 * - Presentation layer shared component: Toggle application theme (light / dark)
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
      (click)="facade.toggleTheme()">
      <span class="material-icons">
        @if (facade.isDark()) { light_mode } @else { dark_mode }
      </span>
    </button>
  `,
  styles: [`
    .theme-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: inherit;
      transition: opacity 0.2s ease;
    }
    
    .theme-toggle:hover {
      opacity: 0.7;
    }
    
    .theme-toggle:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    
    .theme-toggle .material-icons {
      font-size: 1.25rem;
    }
  `]
})
export class ThemeToggleComponent {
  readonly facade = inject(SettingsFacade);
  private readonly document = inject(DOCUMENT);

  constructor() {
    // Apply global theme via body class reactively
    effect(() => {
      const isDark = this.facade.isDark();
      const themeClass = isDark ? 'dark' : 'light';
      
      this.document.body.classList.remove('light', 'dark');
      this.document.body.classList.add(themeClass);
    });
  }
}
