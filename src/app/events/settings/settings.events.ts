import { DomainEvent } from '../domain-event.interface';

export const SETTINGS_SOURCE = 'Settings';

export class SettingUpdated implements DomainEvent<{ key: string; oldValue: any; newValue: any }> {
    readonly type = 'Settings.SettingUpdated';
    readonly source = SETTINGS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { key: string; oldValue: any; newValue: any },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.key;
    }
}

export class IntegrationConfigured implements DomainEvent<{ integrationId: string; provider: string; config: any }> {
    readonly type = 'Settings.IntegrationConfigured';
    readonly source = SETTINGS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { integrationId: string; provider: string; config: any },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.integrationId;
    }
}
