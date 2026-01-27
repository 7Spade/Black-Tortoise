import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { SearchFacade } from '@application/facades/search.facade';
import { PresentationStore } from '@application/stores/presentation.store';

/**
 * SearchComponent
 * 
 * Layer: Presentation - Shared Component
 * Purpose: Pure UI component for search input - no state ownership, no business logic
 * Architecture: Zone-less, Pure Reactive, Signals as single source of truth
 * 
 * DDD Compliance:
 * - Presentation consumes state from Application layer (PresentationStore)
 * - Forwards all user events to Application facade (SearchFacade)
 * - No local state ownership (removed query signal)
 * - No side effects or business logic
 * 
 * Control Flow:
 * 1. User types → onQueryChange → facade.executeSearch()
 * 2. Facade updates PresentationStore
 * 3. Component reads searchQuery() signal from store
 * 4. Template binds to store signals (single source of truth)
 */
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<!-- SearchComponent（Presentation, Shared） -->
<!-- Pure UI: Consumes state from PresentationStore, forwards events to SearchFacade -->
<!-- No local state, no business logic - fully reactive control flow -->
<section class="search">
  <div class="search__controls">
    <input
      id="search-input"
      class="search__input"
      type="search"
      [value]="store.searchQuery()"
      [placeholder]="placeholder()"
      (input)="onQueryChange($any($event.target).value)"
      aria-label="Search input"
    />
    <button 
      class="search__btn" 
      (click)="submit()" 
      type="button" 
      aria-label="Submit search"
      [disabled]="!store.isSearchQueryValid()"
    >
      搜尋
    </button>
    @if (store.isSearchActive()) {
      <button 
        class="search__clear" 
        (click)="clear()" 
        type="button" 
        aria-label="Clear search"
      >
        清除
      </button>
    }
  </div>
</section>
  `,
  styles: [`
/**
 * Search Component Styles
 * 
 * Layer: Presentation
 * Purpose: Themeable search input styles using Material Design 3 tokens
 * 
 * Design System Compliance:
 * - Uses CSS custom properties from m3-tokens.scss
 * - Supports light/dark theme via --md-sys-color-* tokens
 * - No hardcoded colors - all from design system
 * - Responsive spacing using --md-sys-spacing-* tokens
 */

.search {
  display: flex;
  flex-direction: column;
  gap: var(--md-sys-spacing-sm);
  
  &__label {
    font-size: var(--md-sys-typescale-label-large-font-size);
    font-weight: var(--md-sys-typescale-label-large-font-weight);
    color: var(--md-sys-color-on-surface-variant);
  }
  
  &__controls {
    display: flex;
    gap: var(--md-sys-spacing-sm);
    align-items: center;
  }
  
  &__input {
    flex: 1;
    padding: var(--md-sys-spacing-sm) var(--md-sys-spacing-md);
    background-color: var(--md-sys-color-surface-variant);
    color: var(--md-sys-color-on-surface);
    border: 1px solid var(--md-sys-color-outline);
    border-radius: var(--md-sys-shape-corner-sm);
    font-size: var(--md-sys-typescale-body-large-font-size);
    transition: border-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
    
    &:focus {
      outline: none;
      border-color: var(--md-sys-color-primary);
      box-shadow: 0 0 0 1px var(--md-sys-color-primary);
    }
    
    &::placeholder {
      color: var(--md-sys-color-on-surface-variant);
      opacity: 0.6;
    }
  }
  
  &__btn,
  &__clear {
    padding: var(--md-sys-spacing-sm) var(--md-sys-spacing-md);
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    border: none;
    border-radius: var(--md-sys-shape-corner-sm);
    font-size: var(--md-sys-typescale-label-large-font-size);
    font-weight: var(--md-sys-typescale-label-large-font-weight);
    cursor: pointer;
    transition: background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
    
    &:hover:not(:disabled) {
      background-color: var(--md-sys-color-primary);
      opacity: 0.9;
    }
    
    &:active:not(:disabled) {
      opacity: 0.8;
    }
    
    &:disabled {
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      cursor: not-allowed;
      opacity: 0.38;
    }
  }
  
  &__clear {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    
    &:hover {
      background-color: var(--md-sys-color-secondary-container);
      opacity: 0.9;
    }
  }
}
  `]
})
export class SearchComponent {
  // Application layer dependencies
  private readonly facade = inject(SearchFacade);
  protected readonly store = inject(PresentationStore);
  
  // Inputs
  readonly placeholder = input<string>('Search...');

  /**
   * Handle query change - forward to facade
   * No local state mutation, facade controls flow
   */
  onQueryChange(value: string): void {
    this.facade.executeSearch(value);
  }

  /**
   * Handle search submission - forward to facade
   */
  submit(): void {
    this.facade.executeSearch(this.store.searchQuery());
  }

  /**
   * Clear search - forward to facade
   */
  clear(): void {
    this.facade.clearSearch();
  }
}
