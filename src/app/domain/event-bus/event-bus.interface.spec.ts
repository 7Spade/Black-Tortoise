/**
 * EventBus Interface Tests
 * 
 * Layer: Domain
 * Purpose: Test contract compliance for EventBus implementations
 */

import { EventBus, EventHandler } from './event-bus.interface';
import { DomainEvent } from '../event/domain-event';

/**
 * Test helper: Create test event
 */
function createTestEvent(eventType: string, aggregateId: string = 'test-aggregate'): DomainEvent<{ test: string }> {
  const now = Date.now();
  return {
    eventId: `event-${Date.now()}`,
    type: eventType,
    aggregateId,
    correlationId: 'test-correlation',
    causationId: null,
    timestamp: now,
    payload: { test: 'data' },
  };
}

/**
 * Contract test suite for EventBus implementations
 * 
 * All EventBus implementations MUST pass these tests
 */
export function testEventBusContract(createEventBus: () => EventBus): void {
  describe('EventBus Contract', () => {
    let eventBus: EventBus;

    beforeEach(() => {
      eventBus = createEventBus();
    });

    afterEach(() => {
      eventBus.clear();
    });

    it('should publish and receive events', async () => {
      const event = createTestEvent('TestEvent');
      const handler = jest.fn();

      eventBus.subscribe('TestEvent', handler);
      await eventBus.publish(event);

      expect(handler).toHaveBeenCalledWith(event);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should support multiple subscribers for same event type', async () => {
      const event = createTestEvent('TestEvent');
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      eventBus.subscribe('TestEvent', handler1);
      eventBus.subscribe('TestEvent', handler2);
      await eventBus.publish(event);

      expect(handler1).toHaveBeenCalledWith(event);
      expect(handler2).toHaveBeenCalledWith(event);
    });

    it('should only notify subscribers of matching event type', async () => {
      const event = createTestEvent('EventA');
      const handlerA = jest.fn();
      const handlerB = jest.fn();

      eventBus.subscribe('EventA', handlerA);
      eventBus.subscribe('EventB', handlerB);
      await eventBus.publish(event);

      expect(handlerA).toHaveBeenCalled();
      expect(handlerB).not.toHaveBeenCalled();
    });

    it('should notify global subscribers of all events', async () => {
      const event1 = createTestEvent('EventA');
      const event2 = createTestEvent('EventB');
      const globalHandler = jest.fn();

      eventBus.subscribeAll(globalHandler);
      await eventBus.publish(event1);
      await eventBus.publish(event2);

      expect(globalHandler).toHaveBeenCalledTimes(2);
    });

    it('should unsubscribe handlers', async () => {
      const event = createTestEvent('TestEvent');
      const handler = jest.fn();

      const unsubscribe = eventBus.subscribe('TestEvent', handler);
      unsubscribe();
      await eventBus.publish(event);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should publish batch of events', async () => {
      const events = [
        createTestEvent('EventA'),
        createTestEvent('EventB'),
      ];
      const handler = jest.fn();

      eventBus.subscribeAll(handler);
      await eventBus.publishBatch(events);

      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should clear all subscriptions', async () => {
      const event = createTestEvent('TestEvent');
      const handler = jest.fn();

      eventBus.subscribe('TestEvent', handler);
      eventBus.clear();
      await eventBus.publish(event);

      expect(handler).not.toHaveBeenCalled();
    });
  });
}
