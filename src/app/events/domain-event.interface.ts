/**
 * Base definition for all Domain Events in the system.
 * Follows the Event Sourcing pattern and Causality tracking requirements.
 */
export interface DomainEvent<T = unknown> {
    /**
     * Unique identifier for this event instance (UUID)
     */
    readonly id: string;

    /**
     * Application-wide unique event type identifier
     * Format: '[Module].[Action]' (e.g., 'Tasks.Created')
     */
    readonly type: string;

    /**
     * The module or context that generated this event
     */
    readonly source: string;

    /**
     * Unix timestamp (ms) when the event occurred
     */
    readonly timestamp: number;

    /**
     * Trace ID for the entire operation chain
     * Must be propagated from Command -> Event -> Reaction
     */
    readonly correlationId: string;

    /**
     * ID of the direct cause (Command ID or previous Event ID)
     */
    readonly causationId: string | undefined;

    /**
     * The actual business data payload.
     * Must be immutable and serializable.
     */
    readonly payload: T;

    /**
     * Optional metadata for auditing/debugging
     */
    readonly metadata?: Record<string, unknown>;
}

/**
 * Helper type for creating concrete event definitions
 */
export type DomainEventClass<T> = new (
    payload: T,
    correlationId: string,
    causationId?: string
) => DomainEvent<T>;
