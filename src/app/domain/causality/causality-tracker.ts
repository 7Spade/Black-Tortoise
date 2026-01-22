/**
 * Causality Tracker
 * 
 * Layer: Domain
 * DDD Pattern: Domain Service
 * 
 * Tracks causal relationships between domain events to maintain event ordering
 * and dependency chains. This enables event replay and debugging of complex
 * event-driven workflows.
 * 
 * Causality tracking helps answer questions like:
 * - What event caused this event?
 * - What events were triggered as a result of this event?
 * - What is the complete chain of events that led to this state?
 */

export interface CausalityMetadata {
  readonly eventId: string;
  readonly causedBy?: string; // ID of the event that caused this event
  readonly correlationId: string; // Groups related events together
  readonly timestamp: Date;
}

export interface EventCausalityChain {
  readonly eventId: string;
  readonly ancestors: string[]; // All events that led to this event
  readonly descendants: string[]; // All events caused by this event
}

/**
 * Causality Tracker tracks causal relationships between events
 */
export class CausalityTracker {
  private readonly eventChains = new Map<string, EventCausalityChain>();
  private readonly correlationGroups = new Map<string, Set<string>>();

  /**
   * Record a new event and its causal relationship
   */
  recordEvent(metadata: CausalityMetadata): void {
    const { eventId, causedBy, correlationId } = metadata;

    // Build ancestor chain
    const ancestors: string[] = causedBy ? [causedBy] : [];
    if (causedBy) {
      const parentChain = this.eventChains.get(causedBy);
      if (parentChain) {
        ancestors.push(...parentChain.ancestors);
      }
    }

    // Record the event chain
    this.eventChains.set(eventId, {
      eventId,
      ancestors,
      descendants: [],
    });

    // Update parent's descendants
    if (causedBy) {
      const parentChain = this.eventChains.get(causedBy);
      if (parentChain) {
        this.eventChains.set(causedBy, {
          ...parentChain,
          descendants: [...parentChain.descendants, eventId],
        });
      }
    }

    // Track correlation group
    if (!this.correlationGroups.has(correlationId)) {
      this.correlationGroups.set(correlationId, new Set());
    }
    this.correlationGroups.get(correlationId)!.add(eventId);
  }

  /**
   * Get the causal chain for an event
   */
  getEventChain(eventId: string): EventCausalityChain | undefined {
    return this.eventChains.get(eventId);
  }

  /**
   * Get all events in a correlation group
   */
  getCorrelationGroup(correlationId: string): string[] {
    const group = this.correlationGroups.get(correlationId);
    return group ? Array.from(group) : [];
  }

  /**
   * Get the root cause event (first event in the chain)
   */
  getRootCause(eventId: string): string | undefined {
    const chain = this.eventChains.get(eventId);
    if (!chain) {
      return undefined;
    }

    if (chain.ancestors.length === 0) {
      return eventId; // This is the root
    }

    // Find the first ancestor (root)
    return chain.ancestors[chain.ancestors.length - 1];
  }

  /**
   * Check if one event caused another (directly or indirectly)
   */
  isCausedBy(eventId: string, potentialCause: string): boolean {
    const chain = this.eventChains.get(eventId);
    if (!chain) {
      return false;
    }

    return chain.ancestors.includes(potentialCause);
  }

  /**
   * Get all events in the causal chain from root to the given event
   */
  getFullChain(eventId: string): string[] {
    const chain = this.eventChains.get(eventId);
    if (!chain) {
      return [];
    }

    // Return ancestors in chronological order (oldest first) plus the event itself
    return [...chain.ancestors.reverse(), eventId];
  }

  /**
   * Clear all causality tracking data
   */
  clear(): void {
    this.eventChains.clear();
    this.correlationGroups.clear();
  }

  /**
   * Get statistics about the causality graph
   */
  getStatistics(): {
    totalEvents: number;
    totalCorrelationGroups: number;
    averageChainLength: number;
  } {
    const totalEvents = this.eventChains.size;
    const totalCorrelationGroups = this.correlationGroups.size;
    
    let totalChainLength = 0;
    this.eventChains.forEach((chain) => {
      totalChainLength += chain.ancestors.length + 1; // Include the event itself
    });

    return {
      totalEvents,
      totalCorrelationGroups,
      averageChainLength: totalEvents > 0 ? totalChainLength / totalEvents : 0,
    };
  }
}

/**
 * Create a new CausalityTracker instance
 */
export function createCausalityTracker(): CausalityTracker {
  return new CausalityTracker();
}
