/**
 * EventStore Interface Tests
 * 
 * Layer: Domain
 * Purpose: Test contract compliance for EventStore implementations
 */

import { EventStore } from './event-store.interface';
import { DomainEvent } from '../event/domain-event';

/**
 * Test helper: Create test event
 */
function createTestEvent(
  eventType: string,
  aggregateId: string = 'test-aggregate'
): DomainEvent<{ test: string }> {
  const now = Date.now();
  return {
    eventId: `event-${Date.now()}-${Math.random()}`,
    type: eventType,
    aggregateId,
    correlationId: 'test-correlation',
    causationId: null,
    timestamp: now,
    payload: { test: 'data' },
  };
}

/**
 * Contract test suite for EventStore implementations
 * 
 * All EventStore implementations MUST pass these tests
 */
export function testEventStoreContract(createEventStore: () => EventStore): void {
  describe('EventStore Contract', () => {
    let eventStore: EventStore;

    beforeEach(() => {
      eventStore = createEventStore();
    });

    it('should append and retrieve event', async () => {
      const event = createTestEvent('TestEvent', 'agg-1');
      await eventStore.append(event);

      const events = await eventStore.getEventsForAggregate('agg-1');
      expect(events).toHaveLength(1);
      expect(events[0]).toEqual(event);
    });

    it('should append batch of events', async () => {
      const events = [
        createTestEvent('EventA', 'agg-1'),
        createTestEvent('EventB', 'agg-1'),
      ];
      await eventStore.appendBatch(events);

      const retrieved = await eventStore.getEventsForAggregate('agg-1');
      expect(retrieved).toHaveLength(2);
    });

    it('should retrieve events for aggregate in chronological order', async () => {
      const event1 = createTestEvent('Event1', 'agg-1');
      await new Promise(resolve => setTimeout(resolve, 10));
      const event2 = createTestEvent('Event2', 'agg-1');
      
      await eventStore.append(event1);
      await eventStore.append(event2);

      const events = await eventStore.getEventsForAggregate('agg-1');
      expect(events[0].timestamp).toBeLessThan(events[1].timestamp);
    });

    it('should retrieve events by type', async () => {
      await eventStore.append(createTestEvent('EventA', 'agg-1'));
      await eventStore.append(createTestEvent('EventB', 'agg-2'));
      await eventStore.append(createTestEvent('EventA', 'agg-3'));

      const events = await eventStore.getEventsByType('EventA');
      expect(events).toHaveLength(2);
    });

    it('should retrieve events since timestamp', async () => {
      const now = Date.now();
      const event1 = createTestEvent('Event1', 'agg-1');
      event1.timestamp = now - 10000; // 10s ago
      
      const event2 = createTestEvent('Event2', 'agg-2');
      event2.timestamp = now + 10000; // 10s future

      await eventStore.append(event1);
      await eventStore.append(event2);

      const events = await eventStore.getEventsSince(now);
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('Event2');
    });

    it('should retrieve events in time range', async () => {
      const start = new Date('2024-01-01').getTime();
      const end = new Date('2024-01-31').getTime();

      const event1 = createTestEvent('Event1', 'agg-1');
      event1.timestamp = new Date('2024-01-15').getTime();

      const event2 = createTestEvent('Event2', 'agg-2');
      event2.timestamp = new Date('2024-02-15').getTime();

      await eventStore.append(event1);
      await eventStore.append(event2);

      const events = await eventStore.getEventsInRange(start, end);
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('Event1');
    });

    it('should retrieve events by causality', async () => {
      const event1 = createTestEvent('Event1', 'agg-1');
      event1.correlationId = 'correlation-1';

      const event2 = createTestEvent('Event2', 'agg-2');
      event2.correlationId = 'correlation-1';

      const event3 = createTestEvent('Event3', 'agg-3');
      event3.correlationId = 'correlation-2';

      await eventStore.append(event1);
      await eventStore.append(event2);
      await eventStore.append(event3);

      const events = await eventStore.getEventsByCausality('correlation-1');
      expect(events).toHaveLength(2);
    });
  });
}
