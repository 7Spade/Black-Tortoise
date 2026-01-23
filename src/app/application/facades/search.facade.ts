/**
 * Search Facade
 * 
 * Layer: Application - Facade
 * Purpose: Single entry point for search feature - receives search intents,
 *          coordinates with PresentationStore for search state management
 * Architecture: Zone-less, Pure Reactive, Signals as single source of truth
 * 
 * Responsibilities:
 * - Receives user search intent events from UI
 * - Delegates search query state to PresentationStore
 * - Orchestrates search flow (future: can integrate with domain search service)
 * - No business logic - pure orchestration
 * 
 * Control Flow:
 * 1. Presentation forwards search events → facade
 * 2. Facade updates PresentationStore state
 * 3. Presentation consumes state signals from PresentationStore
 */

import { inject, Injectable } from '@angular/core';
import { PresentationStore } from '@application/stores/presentation.store';

@Injectable({ providedIn: 'root' })
export class SearchFacade {
  private readonly presentationStore = inject(PresentationStore);

  /**
   * Execute search with given query
   * Updates store state and triggers search flow
   */
  executeSearch(query: string): void {
    const trimmedQuery = query.trim();
    this.presentationStore.setSearchQuery(trimmedQuery);
    this.presentationStore.setSearchActive(trimmedQuery.length > 0);
    
    // Future: Integrate with domain search service via rxMethod
    // For now, just manage state
  }

  /**
   * Clear search state
   */
  clearSearch(): void {
    this.presentationStore.setSearchQuery('');
    this.presentationStore.setSearchActive(false);
  }

  /**
   * Set search active state
   */
  setActive(active: boolean): void {
    this.presentationStore.setSearchActive(active);
  }
}
