
import { DomainEvent } from '../../events/domain-event';

export interface DashboardRefreshedPayload {
  readonly viewMode: string;
}

export interface DashboardRefreshedEvent extends DomainEvent<DashboardRefreshedPayload> {
  readonly type: 'DashboardRefreshed';
}

export interface CreateDashboardRefreshedEventParams {
  eventId?: string;
  aggregateId: string;
  workspaceId: string;
  payload: DashboardRefreshedPayload;
  causationId?: string | null;
  correlationId: string;
}

export function createDashboardRefreshedEvent(
  params: CreateDashboardRefreshedEventParams
): DashboardRefreshedEvent {
  const { eventId, aggregateId, payload, causationId, correlationId, workspaceId } = params;

  return {
    eventId: eventId ?? crypto.randomUUID(),
    type: 'DashboardRefreshed',
    aggregateId,
    workspaceId,
    correlationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload
  };
}
