import { Injectable } from '@angular/core';

export interface SearchResult {
  readonly id: string;
  readonly title: string;
  readonly type: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  search(query: string): SearchResult[] {
    if (!query) {
      return [];
    }
    return [];
  }
}
