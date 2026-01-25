/**
 * Shared Components Public API
 *
 * Reusable UI components, directives, and pipes
 */

// Components
export * from '../layout/widgets/notification';
export * from '../layout/widgets/search';
export * from '../layout/widgets/theme-toggle';

// Re-export PresentationStore from Application layer (backward compatibility)
export { PresentationStore } from '@application/stores/presentation.store';

