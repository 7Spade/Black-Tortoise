# Audit Module Design

## 1. Responsibilities
- System-wide Operation Logging.
- Security & Accountability Trail.
- Read-Only access.

## 2. Architecture
- **Store**: `AuditStore` (SignalStore - ReadOnly).
- **Infrastructure**: `AuditFirestoreRepository`.

## 3. Data Structures
### Entities
- `AuditEntry`:
  - id, timestamp, actorId, action.
  - targetModule, targetId.
  - details (JSON: before/after).
  - ipAddress.

## 4. Key Logic & Signals
- **State**: `logs` (List).
- **Computed**: `filteredLogs` (Search/Date Range).
- **Logic**: Append-only.

## 5. UI Specifications
- **Log Table**: High density.
- **Filters**: Advanced filtering (Actor, Module, Action Type).
- **Detail View**: JSON Diff viewer.

## 6. Events
- **Subscribe**: **ALL** critical Domain Events -> Transform to AuditEntry.

## 7. File Tree
```
src/app/
  application/
    stores/
      audit.store.ts
  domain/
    audit/
      entities/
        audit-entry.entity.ts
  infrastructure/
    audit/
      audit.firestore.repository.ts
  presentation/
    audit/
      components/
        audit-log-table/
        audit-filter/
      audit.component.ts
```
