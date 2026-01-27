# Quality Control Module Design

## 1. Responsibilities
- Task Output Verification.
- Checklist management.
- Gatekeeper before Acceptance.

## 2. Architecture
- **Store**: `QualityControlStore` (SignalStore).
- **Infrastructure**: `QCFirestoreRepository`.

## 3. Data Structures
### Entities
- `QCItem`: 
  - id, taskId, inspectorId.
  - checklist (Item[]: name, isRequired, pass/fail).
  - status (Pending, Passed, Failed).
  - snapshot (TaskSnapshot).

## 4. Key Logic & Signals
- **State**: `qcItems` (Map).
- **Methods**: `startQC`, `submitResult`.
- **Constraints**: 
  - Pass = All required checked.
  - Fail = Must provide reason (creates Issue).

## 5. UI Specifications
- **Inspector View**: Split screen (Task Snapshot vs Checklist).
- **Checklist**: Interactive form.
- **Reject Dialog**: Forced "Reason" input field.

## 6. Events
- **Publish**: 
  - `QCPassed` -> Updates Task.
  - `QCFailed` -> Updates Task & Creates Issue.
- **Subscribe**: 
  - `TaskReadyForQC` -> Create QCItem.

## 7. File Tree
```
src/app/
  application/
    stores/
      quality-control.store.ts
  domain/
    quality-control/
      entities/
        qc-item.entity.ts
  infrastructure/
    quality-control/
      qc.firestore.repository.ts
  presentation/
    quality-control/
      components/
        qc-list/
        qc-inspection-form/
      quality-control.component.ts
```
