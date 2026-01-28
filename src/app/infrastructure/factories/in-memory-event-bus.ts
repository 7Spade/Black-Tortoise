/**
 * In-Memory Event Bus Implementation
 * 
 * Layer: Infrastructure
 * Purpose: RxJS-based implementation of WorkspaceEventBus interface
 * 
 * This is where RxJS Subject/Observable are used (not in domain layer)
 */

import { DomainEvent } from '@events';
import { EventHandler, WorkspaceEventBus } from '@domain/types';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * In-Memory Event Bus Implementation
 * Uses RxJS Subject for event streaming
 */
export class WorkspaceInMemoryEventBus implements WorkspaceEventBus {
  private readonly events$ = new Subject<DomainEvent<unknown>>();
  private readonly workspaceId: string;
  private readonly subscriptions = new Map<string, Subscription[]>();

  constructor(workspaceId: string) {
    this.workspaceId = workspaceId;
  }

  publish<TPayload>(event: DomainEvent<TPayload>): void {
    console.log(`[EventBus:${this.workspaceId}] Publishing:`, event.type);
    this.events$.next(event as DomainEvent<unknown>);
  }

  subscribe<T extends DomainEvent<TPayload>, TPayload = unknown>(
    eventType: string,
    handler: EventHandler<T, TPayload>
  ): () => void {
    const subscription = this.events$
      .pipe(
        filter(event => event.type === eventType)
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




