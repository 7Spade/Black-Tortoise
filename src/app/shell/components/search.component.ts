import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { SearchFacade } from '@application/facades/search.facade';
import { PresentationStore } from '@application/stores/presentation.store';

/**
 * SearchComponent
 *
 * Layer: Shell UI - Global shared component
 * Purpose: Pure UI component for search input - no state ownership, no business logic
 * Architecture: Zone-less, Pure Reactive, Signals as single source of truth
 */
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./search.component.scss'],
  template: `
    <!-- SearchComponent（Shell UI, Shared） -->
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
})
export class SearchComponent {
  private readonly facade = inject(SearchFacade);
  protected readonly store = inject(PresentationStore);

  readonly placeholder = input<string>('Search...');

  onQueryChange(value: string): void {
    this.facade.executeSearch(value);
  }

  submit(): void {
    this.facade.executeSearch(this.store.searchQuery());
  }

  clear(): void {
    this.facade.clearSearch();
  }
}