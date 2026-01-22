/**
 * Shared Components Public API
 *
 * Reusable UI components, directives, and pipes
 */

// Components
export * from './components/notification';
export * from './components/search';
export * from './components/theme-toggle';

// Re-export PresentationStore from Application layer (backward compatibility)
export { PresentationStore } from '@application/stores/presentation.store';

