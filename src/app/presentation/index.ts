/**
 * Presentation Layer Public API
 * 
 * DDD + Angular 20+ Pure Reactive Architecture
 * Structure: shell/, pages/, organization/, workspace/, team/, settings/, containers/, shared/, theme/
 */

// Shell
export * from './shell';

// Pages
export * from './pages';

// Domain-specific presentation layers
export * from './organization';
export * from './pages/settings';
export * from './team';
export * from './features/workspace';

// Containers
export * from './containers';

// Shared
export * from './shared';

// Root Component
export { AppComponent } from './app.component';

