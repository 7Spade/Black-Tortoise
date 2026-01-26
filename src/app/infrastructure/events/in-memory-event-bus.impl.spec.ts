/**
 * InMemoryEventBus Tests
 * 
 * Layer: Infrastructure
 * Purpose: Test in-memory implementation of EventBus
 */

import { InMemoryEventBus } from './in-memory-event-bus.impl';
import { testEventBusContract } from '@domain/shared/events/event-bus/event-bus.interface.spec';

describe('InMemoryEventBus', () => {
  // Run contract tests
  testEventBusContract(() => new InMemoryEventBus());

  // Implementation-specific tests
  describe('Implementation-specific', () => {
    let bus: InMemoryEventBus;

    beforeEach(() => {
      bus = new InMemoryEventBus();
    });

    afterEach(() => {
      bus.clear();
    });

    it('should track subscriber count', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      expect(bus.getSubscriberCount('TestEvent')).toBe(0);

      bus.subscribe('TestEvent', handler1);
      expect(bus.getSubscriberCount('TestEvent')).toBe(1);

      bus.subscribe('TestEvent', handler2);
      expect(bus.getSubscriberCount('TestEvent')).toBe(2);
    });

    it('should track global subscriber count', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      expect(bus.getGlobalSubscriberCount()).toBe(0);

      bus.subscribeAll(handler1);
      expect(bus.getGlobalSubscriberCount()).toBe(1);

      bus.subscribeAll(handler2);
      expect(bus.getGlobalSubscriberCount()).toBe(2);
    });

    it('should clean up subscriptions after clear', () => {
      const handler = jest.fn();

      bus.subscribe('TestEvent', handler);
      bus.subscribeAll(handler);

      expect(bus.getSubscriberCount('TestEvent')).toBe(1);
      expect(bus.getGlobalSubscriberCount()).toBe(1);

      bus.clear();

      expect(bus.getSubscriberCount('TestEvent')).toBe(0);
      expect(bus.getGlobalSubscriberCount()).toBe(0);
    });
  });
});

