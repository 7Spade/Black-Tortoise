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
import { DomainEvent } from '@domain/event/domain-event';
import { EventBus } from '@domain/event-bus/event-bus.interface';
import { EventStore } from '@domain/event-store/event-store.interface';

export interface PublishEventRequest {
  readonly event: DomainEvent;
}

export interface PublishEventResponse {
  readonly success: boolean;
  readonly error?: string;
}

@Injectable({ providedIn: 'root' })
export class PublishEventUseCase {
  private readonly eventBus = inject(EventBus);
  private readonly eventStore = inject(EventStore);

  /**
   * Execute use case: Publish event
   */
  async execute(request: PublishEventRequest): Promise<PublishEventResponse> {
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
  private validateEvent(event: DomainEvent): void {
    if (!event.eventId) {
      throw new Error('Event must have eventId');
    }
    if (!event.eventType) {
      throw new Error('Event must have eventType');
    }
    if (!event.aggregateId) {
      throw new Error('Event must have aggregateId');
    }
    if (!event.workspaceId) {
      throw new Error('Event must have workspaceId');
    }
    if (!event.timestamp) {
      throw new Error('Event must have timestamp');
    }
    if (!event.correlationId) {
      throw new Error('Event must have correlationId');
    }
  }
}
