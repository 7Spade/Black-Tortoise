import { AggregateRoot } from '@domain/base/aggregate-root';
import { WidgetId } from '../value-objects/widget-id.vo';
import { WidgetPosition } from '../value-objects/widget-position.vo';
import { WidgetType } from '../value-objects/widget-type.vo';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';

// TODO: Define DashboardConfigId VO or reuse Entity<any> with string ID if not defined in VOs list
// Assuming we need a simpler ID strategy for config, possibly just User+Workspace composite, but Aggregate needs ID.
// I'll assume we use a string-based ID for now or create a simple VO interface if we strictly follow Aggregate<Id>.
// Actually, 08-overview docs listed `dashboard-config.aggregate.ts` but didn't list `dashboard-config-id.vo.ts` in the "structure" section I read in Tool Use 2.
// It listed: `widget-id`.
// But an aggregate needs an ID. I will define a local ID based on string for safe implementation.

interface DashboardConfigId {
    value: string;
}

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

    public static create(id: string, workspaceId: WorkspaceId, userId: UserId): DashboardConfigAggregate {
        return new DashboardConfigAggregate({ value: id }, workspaceId, userId);
    }

    public addWidget(widgetId: WidgetId, type: WidgetType, position: WidgetPosition): void {
        this._widgets.set(widgetId.value, { type, position });
    }

    public removeWidget(widgetId: WidgetId): void {
        this._widgets.delete(widgetId.value);
    }
}
