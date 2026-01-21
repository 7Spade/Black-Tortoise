import type { Timestamp } from '../value-objects/timestamp.value-object';

/**
 * Auditable marks entities with audit trail fields.
 */
export interface Auditable {
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}
