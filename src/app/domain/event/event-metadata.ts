/**
 * Event Metadata Value Object
 * 
 * Layer: Domain
 * Purpose: Immutable value object for event tracking and correlation
 * 
 * Causality Tracking:
 * - version: Event schema version for evolution
 * - userId: User who triggered the event
 * - correlationId: Groups related events across aggregates
 * - causationId: Links cause-effect relationships between events
 */

export interface EventMetadata {
  readonly version: number;
  readonly userId?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
}

/**
 * Create Event Metadata (Factory Function)
 * 
 * @param version - Event schema version (default: 1)
 * @param userId - User who triggered the event
 * @param correlationId - Correlation ID for grouping related events
 * @param causationId - Causation ID for tracking event chains
 * @returns Immutable EventMetadata value object
 */
export function createEventMetadata(
  version: number = 1,
  userId?: string,
  correlationId?: string,
  causationId?: string
): EventMetadata {
  return {
    version,
    userId,
    correlationId,
    causationId,
  };
}
