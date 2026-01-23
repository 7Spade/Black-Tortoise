/**
 * InMemoryEventStore Tests
 * 
 * Layer: Infrastructure
 * Purpose: Test in-memory implementation of EventStore
 */

import { InMemoryEventStore } from './in-memory-event-store.impl';
import { testEventStoreContract } from '@domain/event-store/event-store.interface.spec';

describe('InMemoryEventStore', () => {
  // Run contract tests
  testEventStoreContract(() => new InMemoryEventStore());

  // Implementation-specific tests
  describe('Implementation-specific', () => {
    let store: InMemoryEventStore;

    beforeEach(() => {
      store = new InMemoryEventStore();
    });

    it('should clear all events', async () => {
      const now = new Date();
      await store.append({
        eventId: 'e1',
        eventType: 'Test',
        aggregateId: 'agg1',
        workspaceId: 'ws1',
        timestamp: now,
        occurredAt: now,
        causalityId: 'c1',
        payload: {},
        metadata: { version: 1 },
      });

      expect(store.count()).toBe(1);
      store.clear();
      expect(store.count()).toBe(0);
    });

    it('should return correct event count', async () => {
      expect(store.count()).toBe(0);

      const now = new Date();
      await store.append({
        eventId: 'e1',
        eventType: 'Test',
        aggregateId: 'agg1',
        workspaceId: 'ws1',
        timestamp: now,
        occurredAt: now,
        causalityId: 'c1',
        payload: {},
        metadata: { version: 1 },
      });

      expect(store.count()).toBe(1);
    });
  });
});
