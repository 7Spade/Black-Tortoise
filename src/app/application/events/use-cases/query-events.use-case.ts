/**
 * Query Events Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Query events from EventStore
 * 
 * Responsibilities:
 * - Validates query parameters
 * - Retrieves events from EventStore
 * - Returns filtered/sorted results
 * 
 * DDD Pattern: Application Service (Query)
 * CQRS Pattern: Query Handler
 */

import { inject, Injectable } from '@angular/core';
import { DomainEvent } from '@domain/event/domain-event';
import { EVENT_STORE } from '../tokens/event-infrastructure.tokens';

export interface QueryEventsRequest {
  readonly aggregateId?: string;
  readonly eventType?: string;
  readonly correlationId?: string;
  readonly since?: number;
  readonly timeRange?: { start: number; end: number };
}

export interface QueryEventsResponse<TPayload> {
  readonly events: DomainEvent<TPayload>[];
  readonly count: number;
}

@Injectable({ providedIn: 'root' })
export class QueryEventsUseCase {
  private readonly eventStore = inject(EVENT_STORE);

  /**
   * Execute use case: Query events
   */
  async execute<TPayload>(request: QueryEventsRequest): Promise<QueryEventsResponse<TPayload>> {
    const { aggregateId, eventType, correlationId, since, timeRange } = request;

    let events: DomainEvent<TPayload>[] = [];

    // Query by different criteria
    if (aggregateId) {
      events = await this.eventStore.getEventsForAggregate<TPayload>(aggregateId);
    } else if (eventType) {
      events = await this.eventStore.getEventsByType<TPayload>(eventType);
    } else if (correlationId) {
      events = await this.eventStore.getEventsByCausality<TPayload>(correlationId);
    } else if (since !== undefined) {
      events = await this.eventStore.getEventsSince<TPayload>(since);
    } else if (timeRange) {
      events = await this.eventStore.getEventsInRange<TPayload>(timeRange.start, timeRange.end);
    }

    return {
      events,
      count: events.length,
    };
  }
}
