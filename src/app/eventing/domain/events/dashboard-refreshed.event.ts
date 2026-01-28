
import { DomainEvent } from '@eventing/domain/events';
import { EventMetadata } from '@eventing/domain/events';

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
