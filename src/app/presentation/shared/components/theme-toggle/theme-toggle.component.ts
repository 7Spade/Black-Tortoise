import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

/**
 * ThemeToggleComponent
 * - Presentation layer shared component: Toggle application theme (light / dark)
 * - Architecture: Zone-less, OnPush, Angular 20, Signal-based
 * - Component manages UI-level theme toggle and persistence in localStorage
 * - Global theme application is handled via document body class manipulation
 * 
 * Design:
 *   1) Uses `signal()` to store local state for reactive UI binding
 *   2) Persists theme preference in localStorage
 *   3) Applies theme by toggling body classes for global CSS effect
 *   4) Can be enhanced to emit events to Application layer store if needed
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
      (click)="toggle()">
      <span class="material-icons">
        @if (isDark()) { light_mode } @else { dark_mode }
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
  private readonly document = inject(DOCUMENT);
  private readonly themeStorageKey = 'ui.theme';
  
  // Local UI state: dark mode enabled
  isDark = signal(false);

  toggle(): void {
    const nextMode = !this.isDark();
    this.isDark.set(nextMode);
    
    // Persist to localStorage
    localStorage.setItem(this.themeStorageKey, nextMode ? 'dark' : 'light');
    
    // Apply global theme via body class
    this.document.body.classList.remove('light', 'dark');
    this.document.body.classList.add(nextMode ? 'dark' : 'light');
  }

  constructor() {
    // Initialize from localStorage or system preference
    const storedTheme = localStorage.getItem(this.themeStorageKey);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
    
    this.isDark.set(initialDark);
    this.document.body.classList.remove('light', 'dark');
    this.document.body.classList.add(initialDark ? 'dark' : 'light');
  }
}
