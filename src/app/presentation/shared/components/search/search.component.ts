import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, output, signal, input } from '@angular/core';

export interface SearchResult {
  readonly id: string;
  readonly title: string;
  readonly type: string;
}

/**
 * SearchComponent
 * - Presentation layer shared search component (Standalone component)
 * - Component is only responsible for display and input (query) behavior; actual search should be performed by Application layer (store / service / use-case).
 * - Design points:
 *   1) Use `signal()` to store local input state for UI binding.
 *   2) Do not directly call infrastructure or execute side effects in the component; use injected store or external handler instead.
 *   3) If debounce / async control is needed, handle it in application layer with rxMethod/tapResponse or corresponding strategy.
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
  // Inputs
  readonly placeholder = input<string>('Search...');
  
  // Outputs - component events
  readonly searchQuery = output<string>();
  readonly searchResults = output<SearchResult[]>();
  
  // Local UI state: user input query string
  query = signal('');

  onQueryChange(value: string): void {
    this.query.set(value);
    this.searchQuery.emit(value);
    
    // Placeholder logic - emit empty results
    const results: SearchResult[] = [];
    this.searchResults.emit(results);
  }

  submit(): void {
    this.searchQuery.emit(this.query());
  }
}
