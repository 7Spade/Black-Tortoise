
import { DomainEvent } from '../../events/domain-event';

export interface SettingsUpdatedPayload {
  readonly settingKey: string;
  readonly newValue: any;
  readonly oldValue: any;
}

export interface SettingsUpdatedEvent extends DomainEvent<SettingsUpdatedPayload> {
  readonly type: 'SettingsUpdated';
}

export interface CreateSettingsUpdatedEventParams {
  eventId?: string;
  aggregateId: string; // workspaceId
  workspaceId: string;
  payload: SettingsUpdatedPayload;
  causationId?: string | null;
  correlationId: string;
}

export function createSettingsUpdatedEvent(
  params: CreateSettingsUpdatedEventParams
): SettingsUpdatedEvent {
  const { eventId, aggregateId, payload, causationId, correlationId, workspaceId } = params;

  return {
    eventId: eventId ?? crypto.randomUUID(),
    type: 'SettingsUpdated',
    aggregateId,
    workspaceId,
    correlationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload
  };
}
