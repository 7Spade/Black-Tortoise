# Daily Module Design

## 1. Responsibilities
- Personal Worklog (Timesheet).
- Man-Day calculation (Traditional industry style).
- Auto-recording based on Task interaction.

## 2. Architecture
- **Store**: `DailyStore` (SignalStore).
- **Service**: `DailyService`.
- **Infrastructure**: `DailyFirestoreRepository`.

## 3. Data Structures
### Entities
- `DailyEntry`: 
  - id, taskId, workerId, date.
  - manDays (0.1 - 1.0).
  - description, completedQuantity.
  - type (Auto/Manual).

## 4. Key Logic & Signals
- **State**: `entries` (Map<Date, DailyEntry[]>).
- **Computed**: 
  - `todayEntries`: Filter for current date.
  - `weeklyStats`: Aggregation by user/project.
- **Methods**: `logWork`, `autoLogFromTask`, `validateManDayLimit`.

## 5. UI Specifications
- **Quick Entry**: "Today's Active Tasks" selector.
- **Calendar/Grid**: Weekly view of man-days.
- **Validation**: Visual warning if > 1.0 man-day/day.

## 6. Events
- **Publish**: `DailyEntryCreated`, `DailyEntryUpdated`.
- **Subscribe**: 
  - `TaskProgressUpdated` -> Trigger auto-log logic (debounced).

## 7. File Tree
```
src/app/
  application/
    stores/
      daily.store.ts
  domain/
    daily/
      entities/
        daily-entry.entity.ts
  infrastructure/
    daily/
      daily.firestore.repository.ts
  presentation/
    daily/
      components/
        daily-entry-form/
        daily-calendar/
        daily-stats/
      daily.component.ts
```
