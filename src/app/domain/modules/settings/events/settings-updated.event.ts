
import { DomainEvent } from '@domain/shared/events';
import { EventMetadata } from '@domain/shared/events/event-metadata';

export interface SettingsUpdatedPayload {
  readonly settingKey: string;
  readonly newValue: any;
  readonly oldValue: any;
}

export class SettingsUpdatedEvent implements DomainEvent<SettingsUpdatedPayload> {
  readonly type = 'SettingsUpdated'; // Custom string if not in Enum
  readonly timestamp = Date.now();

  constructor(
    readonly eventId: string,
    readonly aggregateId: string, // workspaceId
    readonly workspaceId: string,
    readonly payload: SettingsUpdatedPayload,
    readonly causationId: string | null,
    readonly correlationId: string,
    readonly metadata: EventMetadata = {} as any
  ) {}
}
