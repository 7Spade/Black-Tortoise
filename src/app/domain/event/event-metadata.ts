/**
 * Event Metadata
 * 
 * Layer: Domain
 * Purpose: Metadata for tracking event causation and correlation
 */

export interface EventMetadata {
  readonly causationId?: string;
  readonly correlationId?: string;
  readonly userId?: string;
  readonly timestamp: Date;
}

export function createEventMetadata(
  causationId?: string,
  correlationId?: string,
  userId?: string
): EventMetadata {
  return {
    causationId: causationId,
    correlationId: correlationId,
    userId: userId,
    timestamp: new Date(),
  };
}
