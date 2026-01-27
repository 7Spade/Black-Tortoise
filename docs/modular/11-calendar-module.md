# Calendar Module Design

## 1. Responsibilities
- Time-centric view of Workspace activity.
- Aggregate Tasks (Deadlines) and Daily (Worklogs).
- Visual planning.

## 2. Architecture
- **Store**: `CalendarStore` (SignalStore).
- **Service**: Agnostic Aggregator.
- **Infrastructure**: None (Views over other modules).

## 3. Data Structures
### View Models
- `CalendarEvent`: 
  - id, title, start, end.
  - type (Task/Log), color.
  - meta (original entity ref).

## 4. Key Logic & Signals
- **State**: `viewDate` (Date), `viewMode` (Month/Week).
- **Computed**: `events` (derived from `tasksStore.entities` + `dailyStore.entries`).
- **Logic**: 
  - Zero-Refetch: Just map existing store entities to CalendarEvents.
  - Dragging event -> Calls `TasksService.updateDueDate`.

## 5. UI Specifications
- **Calendar Comp**: Month grid, Week time-grid.
- **Event Chips**: Colored by Type/Status.
- **Filters**: By Assignee, Type.

## 6. Events
- **Subscribe**: None (Reactive to Store Signals directly via `computed`).

## 7. File Tree
```
src/app/
  application/
    stores/
      calendar.store.ts
  presentation/
    calendar/
      components/
        month-view/
        week-view/
        event-chip/
        calendar-toolbar/
      calendar.component.ts
```
