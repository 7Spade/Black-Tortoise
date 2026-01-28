/**
 * Publish Event Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Orchestrates event publishing workflow
 * 
 * Responsibilities:
 * - Validates event payload
 * - Publishes to EventBus (real-time)
 * - Persists to EventStore (history)
 * - Returns success/failure
 * 
 * DDD Pattern: Application Service
 * Clean Architecture: Use Case Interactor
 */

import { inject, Injectable } from '@angular/core';
import { DomainEvent } from '@eventing/domain/events';
import { EVENT_BUS, EVENT_STORE } from '../interfaces/event-infrastructure.tokens';

export interface PublishEventRequest<TPayload> {
  readonly event: DomainEvent<TPayload>;
}

export interface PublishEventResponse {
  readonly success: boolean;
  readonly error?: string;
}

@Injectable({ providedIn: 'root' })
export class PublishEventHandler {
  private readonly eventBus = inject(EVENT_BUS);
  private readonly eventStore = inject(EVENT_STORE);

  /**
   * Execute use case: Publish event
   */
  async execute<TPayload>(request: PublishEventRequest<TPayload>): Promise<PublishEventResponse> {
    try {
      const { event } = request;

      // Validate event
      this.validateEvent(event);

      // Persist to store FIRST (append-only, history)
      await this.eventStore.append(event);

      // Publish to bus AFTER (real-time notification)
      await this.eventBus.publish(event);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Validate event structure
   */
  private validateEvent<TPayload>(event: DomainEvent<TPayload>): void {
    if (!event.eventId) {
      throw new Error('Event must have eventId');
    }
    if (!event.type) {
      throw new Error('Event must have type');
    }
    if (!event.aggregateId) {
      throw new Error('Event must have aggregateId');
    }
    if (event.timestamp === undefined || event.timestamp === null) {
      throw new Error('Event must have timestamp');
    }
    if (typeof event.timestamp !== 'number') {
      throw new Error('Event timestamp must be a number (milliseconds)');
    }
    if (!event.correlationId) {
      throw new Error('Event must have correlationId');
    }
    if (event.causationId !== null && typeof event.causationId !== 'string') {
      throw new Error('Event causationId must be string or null');
    }
  }
}

