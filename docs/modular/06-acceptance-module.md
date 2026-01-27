# Acceptance Module Design

## 1. Responsibilities
- Commercial/Business Acceptance of deliverables.
- Final gate before Task Completion.
- Manages Acceptance Criteria and Sign-offs.

## 2. Architecture
- **Store**: `AcceptanceStore` (SignalStore).
- **Service**: `AcceptanceService`.
- **Infrastructure**: `AcceptanceFirestoreRepository`.

## 3. Data Structures
### Entities
- `AcceptanceItem`:
  - id, taskId, validatorId.
  - criteria (Item[]: desc, result).
  - docs (documents[]).
  - status (Pending, Approved, Rejected).
  - notes.

## 4. Key Logic & Signals
- **State**: `acceptanceItems` (Map).
- **Computeds**: `pendingCount`, `myPendingItems`.
- **Methods**: `approve`, `reject` (requires reason).

## 5. UI Specifications
- **Review UI**: Show Task Deliverables vs Criteria.
- **Sign-off**: Digital signature metaphor (optional), simple "Approve" button.
- **Rejection**: Mandatory rejection reason input.

## 6. Events
- **Publish**:
  - `AcceptanceApproved` -> Task Completed.
  - `AcceptanceRejected` -> Task Blocked + Issue Created.
- **Subscribe**:
  - `TaskReadyForAcceptance` (from Task/QC).

## 7. File Tree
```
src/app/
  application/
    stores/
      acceptance.store.ts
  domain/
    acceptance/
      entities/
        acceptance-item.entity.ts
  infrastructure/
    acceptance/
      acceptance.firestore.repository.ts
  presentation/
    acceptance/
      components/
        acceptance-list/
        acceptance-review/
      acceptance.component.ts
```
