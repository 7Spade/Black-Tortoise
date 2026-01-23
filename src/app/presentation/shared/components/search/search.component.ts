import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
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
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
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
