
import { DomainEvent } from '@domain/shared/events';
import { EventMetadata } from '@domain/shared/events/event-metadata';

export interface DashboardRefreshedPayload {
  readonly viewMode: string;
}

export class DashboardRefreshedEvent implements DomainEvent<DashboardRefreshedPayload> {
  readonly type = 'DashboardRefreshed';
  readonly timestamp = Date.now();

  constructor(
    readonly eventId: string,
    readonly aggregateId: string,
    readonly workspaceId: string,
    readonly payload: DashboardRefreshedPayload,
    readonly causationId: string | null,
    readonly correlationId: string,
    readonly metadata: EventMetadata = {} as any
  ) {}
}
