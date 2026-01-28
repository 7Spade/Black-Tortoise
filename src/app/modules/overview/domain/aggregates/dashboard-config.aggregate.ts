import { AggregateRoot } from '@domain/base/aggregate-root';
import { DashboardConfigId } from '@overview/domain/value-objects/dashboard-config-id.vo';
import { WidgetId } from '@overview/domain/value-objects/widget-id.vo';
import { WidgetPosition } from '@overview/domain/value-objects/widget-position.vo';
import { WidgetType } from '@overview/domain/value-objects/widget-type.vo';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';

/**
 * Dashboard Config Aggregate
 * 
 * Persists user-specific dashboard layouts.
 */
export class DashboardConfigAggregate extends AggregateRoot<DashboardConfigId> {
    private _widgets: Map<string, { type: WidgetType, position: WidgetPosition }> = new Map();

    private constructor(
        id: DashboardConfigId,
        public readonly workspaceId: WorkspaceId,
        public readonly userId: UserId
    ) {
        super(id);
    }

    public static create(id: DashboardConfigId, workspaceId: WorkspaceId, userId: UserId): DashboardConfigAggregate {
        return new DashboardConfigAggregate(id, workspaceId, userId);
    }

    public addWidget(widgetId: WidgetId, type: WidgetType, position: WidgetPosition): void {
        this._widgets.set(widgetId.value, { type, position });
    }

    public removeWidget(widgetId: WidgetId): void {
        this._widgets.delete(widgetId.value);
    }
}
