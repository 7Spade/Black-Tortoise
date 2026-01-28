import { DomainEvent } from '../domain-event.interface';

export const OVERVIEW_SOURCE = 'Overview';

export class DashboardLayoutUpdated implements DomainEvent<{ userId: string; layoutConfig: any }> {
    readonly type = 'Overview.DashboardLayoutUpdated';
    readonly source = OVERVIEW_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { userId: string; layoutConfig: any },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.userId;
    }
}

export class WidgetAdded implements DomainEvent<{ userId: string; widgetType: string; settings: any }> {
    readonly type = 'Overview.WidgetAdded';
    readonly source = OVERVIEW_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { userId: string; widgetType: string; settings: any },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.userId;
    }
}

export class WidgetRemoved implements DomainEvent<{ userId: string; widgetId: string }> {
    readonly type = 'Overview.WidgetRemoved';
    readonly source = OVERVIEW_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { userId: string; widgetId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.userId;
    }
}
