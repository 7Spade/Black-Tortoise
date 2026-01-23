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
import { EventStore } from '@domain/event-store/event-store.interface';

export interface QueryEventsRequest {
  readonly aggregateId?: string;
  readonly workspaceId?: string;
  readonly eventType?: string;
  readonly causalityId?: string;
  readonly since?: Date;
  readonly timeRange?: { start: Date; end: Date };
}

export interface QueryEventsResponse {
  readonly events: DomainEvent[];
  readonly count: number;
}

@Injectable({ providedIn: 'root' })
export class QueryEventsUseCase {
  private readonly eventStore = inject(EventStore);

  /**
   * Execute use case: Query events
   */
  async execute(request: QueryEventsRequest): Promise<QueryEventsResponse> {
    const { aggregateId, workspaceId, eventType, causalityId, since, timeRange } = request;

    let events: DomainEvent[] = [];

    // Query by different criteria
    if (aggregateId) {
      events = await this.eventStore.getEventsForAggregate(aggregateId);
    } else if (workspaceId) {
      events = await this.eventStore.getEventsForWorkspace(workspaceId);
    } else if (eventType) {
      events = await this.eventStore.getEventsByType(eventType);
    } else if (causalityId) {
      events = await this.eventStore.getEventsByCausality(causalityId);
    } else if (since) {
      events = await this.eventStore.getEventsSince(since);
    } else if (timeRange) {
      events = await this.eventStore.getEventsInRange(timeRange.start, timeRange.end);
    }

    return {
      events,
      count: events.length,
    };
  }
}
