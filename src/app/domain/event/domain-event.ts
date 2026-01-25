/**
 * Domain Event Base Interface
 * 
 * Layer: Domain
 * Purpose: Base interface for all domain events in the system
 * No dependencies on Angular or RxJS
 * 
 * Event Sourcing & CQRS Pattern:
 * - eventId: Unique identifier for this event instance
 * - type: Type discriminator for event handling (past tense, e.g., "TaskCreated")
 * - aggregateId: The aggregate root this event belongs to
 * - correlationId: Tracks entire causal chain (first event in chain, always required)
 * - causationId: Direct cause of this event (nullable only for root events)
 * - timestamp: When the event occurred (Unix timestamp in milliseconds)
 * - payload: Event-specific data (strongly typed per event)
 */

export interface DomainEvent<TPayload> {
  readonly eventId: string;
  readonly type: string;
  readonly aggregateId: string;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly timestamp: number;
  readonly payload: TPayload;
}
