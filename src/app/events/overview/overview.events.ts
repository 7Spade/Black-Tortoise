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

// Helpers for backward compatibility
export function createDashboardLayoutUpdatedEvent(payload: { userId: string; layoutConfig: any }, correlationId: string, causationId?: string | null): DashboardLayoutUpdated {
    return new DashboardLayoutUpdated(payload, correlationId, causationId ?? undefined);
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

export function createWidgetAddedEvent(payload: { userId: string; widgetType: string; settings: any }, correlationId: string, causationId?: string | null): WidgetAdded {
    return new WidgetAdded(payload, correlationId, causationId ?? undefined);
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

export function createWidgetRemovedEvent(payload: { userId: string; widgetId: string }, correlationId: string, causationId?: string | null): WidgetRemoved {
    return new WidgetRemoved(payload, correlationId, causationId ?? undefined);
}
