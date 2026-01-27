# Tasks Module Design (Core)

## 1. Responsibilities
- Core Task & Project Management.
- Task Attributes: Unit price, Quantity, Progress, Assignment.
- Hierarchy: Infinite sub-tasks.
- Workflow flow: Draft -> QC -> Acceptance -> Done.

## 2. Architecture
- **Store**: `TasksStore` (SignalStore). This is the Single Source of Truth for tasks.
- **Service**: `TasksService`.
- **Infrastructure**: `TasksFirestoreRepository`.

## 3. Data Structures
### Entities
- `Task`: 
  - id, title, description
  - unitPrice (Money), quantity, totalPrice (Computed)
  - progress (%), status (Enum)
  - priority, dueDate
  - assignees[], owner, collaborators[]
  - parentId, children[] (Aggregation)

## 4. Key Logic & Signals
- **State**: `taskMap` (Map<Id, Task>), `viewMode` (List/Gantt/Kanban).
- **Computed**: 
  - `visibleTasks`: Filtered/Sorted projection.
  - `progress`: Parent progress = weighted average of children.
  - `totalPrice`: Sum of children prices.
- **Methods**: `updateProgress`, `assignUser`, `changeStatus`, `moveTask`.

## 5. UI Specifications
- **Views**: List Object, Gantt (CSS Grid), Kanban (CDK Drag&Drop).
- **Interaction**: Zero-refetch view switching.
- **Forms**: Complex forms for unit price/quantity calculation.

## 6. Events
- **Publish**: 
  - `TaskCreated`, `TaskUpdated`, `TaskAssigneeChanged`.
  - `TaskProgressUpdated` (triggers Daily).
  - `TaskReadyForQC` (triggers QC).
  - `TaskReadyForAcceptance` (triggers Acceptance).
- **Subscribe**:
  - `QCPassed`, `QCFailed` (from QC).
  - `AcceptanceApproved`, `AcceptanceRejected` (from Acceptance).
  - `IssueResolved` (from Issues) -> Unblock task.

## 7. File Tree
```
src/app/
  application/
    stores/
      tasks.store.ts
    services/
      tasks.service.ts
  domain/
    tasks/
      entities/
        task.entity.ts
      value-objects/
        money.vo.ts
        task-status.vo.ts
      repositories/
        tasks.repository.ts
  infrastructure/
    tasks/
      tasks.firestore.repository.ts
  presentation/
    tasks/
      components/
        task-list/
        task-gantt/
        task-kanban/
        task-detail/
      tasks.component.ts
      tasks.routes.ts
```
