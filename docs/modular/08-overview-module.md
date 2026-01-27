# Overview Module Design

## 1. Responsibilities
- Workspace Dashboard & KPI Aggregation.
- Activity Timeline.
- Navigation hub (Widgets).

## 2. Architecture
- **Store**: `OverviewStore` (SignalStore).
- **Service**: None (Aggregator mostly).
- **Infrastructure**: `OverviewService` (might fetch aggregated metrics or listen to streams).

## 3. Data Structures
### View Models
- `DashboardMetric`: label, value, trend, type.
- `ActivityLog`: timestamp, actor, action, target.
- `WidgetConfig`: id, type, position, size.

## 4. Key Logic & Signals
- **State**: `metrics` (Map), `activities` (List), `layout` (Config).
- **Computed**: `visibleWidgets`.
- **Logic**:
  - React to global events to update counters locally (Optimistic) or fetch periodically.

## 5. UI Specifications
- **Grid Layout**: Responsive CSS Grid / Masonry.
- **Widgets**: Task Progress, Issue Status, Recent Files, Team Load.
- **Customization**: Drag & Drop ordering.

## 6. Events
- **Subscribe**: Global Listeners for `TaskCompleted`, `IssueCreated`, etc., to update counters.

## 7. File Tree
```
src/app/
  application/
    stores/
      overview.store.ts
  presentation/
    overview/
      components/
        dashboard-grid/
        widgets/
          task-widget/
          issue-widget/
        activity-timeline/
      overview.component.ts
```
