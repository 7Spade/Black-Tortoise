/**
 * Application - Events Module
 * 
 * Layer: Application
 * Purpose: Event management use cases and orchestration
 * 
 * Exports:
 * - PublishEventUseCase: Orchestrates event publishing
 * - QueryEventsUseCase: Queries events from store
 * - EVENT_BUS: Injection token for EventBus
 * - EVENT_STORE: Injection token for EventStore
 */

export { PublishEventUseCase } from './use-cases/publish-event.use-case';
export { QueryEventsUseCase } from './use-cases/query-events.use-case';
export { EVENT_BUS, EVENT_STORE } from './tokens/event-infrastructure.tokens';
