/**
 * In-Memory Event Bus Implementation
 * 
 * Layer: Infrastructure
 * Purpose: RxJS-based implementation of WorkspaceEventBus interface
 * 
 * This is where RxJS Subject/Observable are used (not in domain layer)
 */

import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DomainEvent } from '../../domain/event/domain-event';
import { WorkspaceEventBus, EventHandler } from '../../domain/workspace/workspace-event-bus';

/**
 * In-Memory Event Bus Implementation
 * Uses RxJS Subject for event streaming
 */
export class InMemoryEventBus implements WorkspaceEventBus {
  private readonly events$ = new Subject<DomainEvent>();
  private readonly workspaceId: string;
  private readonly subscriptions = new Map<string, Subscription[]>();
  
  constructor(workspaceId: string) {
    this.workspaceId = workspaceId;
  }
  
  publish(event: DomainEvent): void {
    console.log(`[EventBus:${this.workspaceId}] Publishing:`, event.eventType);
    this.events$.next(event);
  }
  
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): () => void {
    const subscription = this.events$
      .pipe(
        filter(event => event.eventType === eventType)
      )
      .subscribe(event => handler(event as T));
    
    // Store subscription for cleanup
    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }
    this.subscriptions.get(eventType)!.push(subscription);
    
    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
      const subs = this.subscriptions.get(eventType);
      if (subs) {
        const index = subs.indexOf(subscription);
        if (index > -1) {
          subs.splice(index, 1);
        }
      }
    };
  }
  
  getWorkspaceId(): string {
    return this.workspaceId;
  }
  
  clear(): void {
    console.log(`[EventBus:${this.workspaceId}] Clearing all subscriptions`);
    this.subscriptions.forEach(subs => {
      subs.forEach(sub => sub.unsubscribe());
    });
    this.subscriptions.clear();
    this.events$.complete();
  }
}
