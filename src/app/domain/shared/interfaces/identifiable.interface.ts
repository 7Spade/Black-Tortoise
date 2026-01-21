import type { Id } from '../value-objects/id.value-object';

/**
 * Identifiable marks entities with unique identity.
 */
export interface Identifiable {
  readonly id: Id;
}
