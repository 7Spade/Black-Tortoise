# Issues Module Design

## 1. Responsibilities
- Defect and Issue Tracking.
- Managing blocking states for Tasks.
- "Closing the loop" on QC/Acceptance failures.

## 2. Architecture
- **Store**: `IssuesStore` (SignalStore).
- **Service**: `IssuesService`.
- **Infrastructure**: `IssuesFirestoreRepository`.

## 3. Data Structures
### Entities
- `Issue`:
  - id, title, description, type (Defect, Bug, Change).
  - priority, status (Open, InProgress, Resolved, Closed).
  - relatedTaskId, assignee, reporter.
  - attachments[].

## 4. Key Logic & Signals
- **State**: `issues` (Map).
- **Computed**: `blockingIssues` (filtered by status).
- **Methods**: `createIssue`, `resolveIssue`, `closeIssue`.
- **Logic**: 
  - Cannot close Task if open Issues exist.
  - Resolving Issue notifies Task owner.

## 5. UI Specifications
- **Issue Board/List**: Standard tracking view.
- **Context Creation**: Auto-fill details when created from QC failure.
- **Detail View**: Chat-like activity history.

## 6. Events
- **Publish**: 
  - `IssueCreated`, `IssueResolved`, `IssueClosed`.
- **Subscribe**:
  - `QCFailed` -> Auto-create Issue.
  - `AcceptanceRejected` -> Auto-create Issue.

## 7. File Tree
```
src/app/
  application/
    stores/
      issues.store.ts
  domain/
    issues/
      entities/
        issue.entity.ts
  infrastructure/
    issues/
      issues.firestore.repository.ts
  presentation/
    issues/
      components/
        issue-list/
        issue-detail/
        create-issue-dialog/
      issues.component.ts
```
