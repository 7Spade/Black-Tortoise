# Event-to-Module Mapping Reference
## Quick Reference for Event Flow Architecture

Generated: 2024-01-25
Based on: Comment 3796666592 Audit

---

## Complete Event Catalog (19 Events)

### Task Lifecycle Events (6)
1. **TaskCreated**
   - Publisher: Tasks Module → CreateTaskUseCase
   - Subscribers: Calendar, Overview, Audit
   - Payload: workspaceId, taskId, title, description, priority, createdById

2. **TaskSubmittedForQC**
   - Publisher: Tasks Module → SubmitTaskForQCUseCase
   - Subscribers: QualityControl, Audit
   - Payload: workspaceId, taskId, taskTitle, submittedBy

3. **QCPassed**
   - Publisher: QualityControl Module → PassQCUseCase
   - Subscribers: Acceptance, Tasks, Audit
   - Payload: workspaceId, taskId, taskTitle, reviewerId, reviewNotes?

4. **QCFailed**
   - Publisher: QualityControl Module → FailQCUseCase
   - Subscribers: Issues, Tasks, Audit
   - Payload: workspaceId, taskId, taskTitle, failureReason, reviewedBy

5. **TaskCompleted**
   - Publisher: Tasks Module
   - Subscribers: Overview, Audit
   - Payload: workspaceId, taskId, completedBy

6. **AcceptanceApproved**
   - Publisher: Acceptance Module → ApproveTaskUseCase
   - Subscribers: Tasks, Overview, Audit
   - Payload: workspaceId, taskId, taskTitle, approvedBy, notes?

7. **AcceptanceRejected**
   - Publisher: Acceptance Module → RejectTaskUseCase
   - Subscribers: Issues, Tasks, Audit
   - Payload: workspaceId, taskId, taskTitle, rejectedBy, reason

### Issue Management Events (2)
8. **IssueCreated**
   - Publisher: Issues Module → CreateIssueUseCase
   - Subscribers: Tasks, Overview, Audit
   - Payload: workspaceId, issueId, title, description, priority, relatedTaskId?

9. **IssueResolved**
   - Publisher: Issues Module → ResolveIssueUseCase
   - Subscribers: Tasks, Overview, Audit
   - Payload: workspaceId, issueId, taskId, resolvedBy, resolution

### Work Log Events (1)
10. **DailyEntryCreated**
    - Publisher: Daily Module → CreateDailyEntryUseCase
    - Subscribers: Overview, Audit
    - Payload: workspaceId, entryId, date, hoursLogged, notes, userId

### Document Events (1)
11. **DocumentUploaded**
    - Publisher: Documents Module
    - Subscribers: Overview, Audit
    - Payload: workspaceId, documentId, fileName, fileSize, uploadedBy

### Team Events (2)
12. **MemberInvited**
    - Publisher: Members Module
    - Subscribers: Permissions, Audit
    - Payload: workspaceId, memberId, email, roleId, invitedBy

13. **MemberRemoved**
    - Publisher: Members Module
    - Subscribers: Permissions, Audit
    - Payload: workspaceId, memberId, removedBy

### Permission Events (2)
14. **PermissionGranted**
    - Publisher: Permissions Module
    - Subscribers: Overview, Audit
    - Payload: workspaceId, roleId, resource, action, grantedBy

15. **PermissionRevoked**
    - Publisher: Permissions Module
    - Subscribers: Overview, Audit
    - Payload: workspaceId, roleId, resource, action, revokedBy

### Workspace Events (2)
16. **WorkspaceCreated**
    - Publisher: Workspace → CreateWorkspaceUseCase
    - Subscribers: Overview, Audit
    - Payload: workspaceId, name, ownerId, organizationId

17. **WorkspaceSwitched**
    - Publisher: Workspace → SwitchWorkspaceUseCase
    - Subscribers: ALL MODULES
    - Payload: previousWorkspaceId, currentWorkspaceId, userId?

### Module Lifecycle Events (2)
18. **ModuleActivated**
    - Publisher: Shell
    - Subscribers: Audit
    - Payload: workspaceId, moduleId, moduleName

19. **ModuleDeactivated**
    - Publisher: Shell
    - Subscribers: Audit
    - Payload: workspaceId, moduleId, moduleName

---

## Module Subscription Matrix

| Module | Publishes | Subscribes To |
|--------|-----------|---------------|
| **Tasks** | TaskCreated, TaskSubmittedForQC, TaskCompleted | QCPassed, QCFailed, AcceptanceApproved, AcceptanceRejected, IssueCreated, IssueResolved, WorkspaceSwitched |
| **QualityControl** | QCPassed, QCFailed | TaskSubmittedForQC, WorkspaceSwitched |
| **Acceptance** | AcceptanceApproved, AcceptanceRejected | QCPassed, WorkspaceSwitched |
| **Issues** | IssueCreated, IssueResolved | QCFailed, AcceptanceRejected, WorkspaceSwitched |
| **Daily** | DailyEntryCreated | WorkspaceSwitched |
| **Documents** | DocumentUploaded | WorkspaceSwitched |
| **Members** | MemberInvited, MemberRemoved | WorkspaceSwitched |
| **Permissions** | PermissionGranted, PermissionRevoked | MemberInvited, MemberRemoved, WorkspaceSwitched |
| **Overview** | - | TaskCreated, QCPassed, AcceptanceApproved, IssueCreated, IssueResolved, DailyEntryCreated, WorkspaceSwitched (ALL) |
| **Calendar** | - | TaskCreated, WorkspaceSwitched |
| **Settings** | - | WorkspaceSwitched |
| **Audit** | - | ALL EVENTS (global subscriber) |

---

## Event Flow Patterns

### Pattern 1: Task Success Flow
```
User → Tasks.CreateTask()
  ↓ TaskCreated
  → Calendar (displays)
  → Overview (updates metrics)
  → Audit (logs)

User → Tasks.SubmitForQC()
  ↓ TaskSubmittedForQC
  → QualityControl (adds to queue)
  → Audit (logs)

User → QualityControl.PassQC()
  ↓ QCPassed
  → Acceptance (adds to queue)
  → Tasks (updates status)
  → Audit (logs)

User → Acceptance.Approve()
  ↓ AcceptanceApproved
  → Tasks (marks complete)
  → Overview (updates metrics)
  → Audit (logs)
```

### Pattern 2: Task Failure Flow
```
User → QualityControl.FailQC()
  ↓ QCFailed
  → Issues (auto-creates issue)
  → Tasks (blocks task)
  → Audit (logs)

  ↓ IssueCreated
  → Tasks (adds blocker reference)
  → Overview (updates metrics)
  → Audit (logs)

Developer fixes → Issues.Resolve()
  ↓ IssueResolved
  → Tasks (unblocks task)
  → Overview (updates metrics)
  → Audit (logs)

User → Tasks.SubmitForQC() [retry]
  ↓ [back to Pattern 1]
```

### Pattern 3: Workspace Switching
```
User → Workspace.Switch(newWorkspaceId)
  ↓ WorkspaceSwitched
  → ALL 12 MODULES
    - Clear local state
    - Reload workspace-scoped data
    - Reinitialize subscriptions
```

---

## Causality Chain Example

```
User creates task (correlationId: A):
  TaskCreated(A, null)
    ↓ causationId: null (root event)
    
User submits for QC:
  TaskSubmittedForQC(A, TaskCreated.eventId)
    ↓ causationId: TaskCreated.eventId
    
QC fails task:
  QCFailed(A, TaskSubmittedForQC.eventId)
    ↓ causationId: TaskSubmittedForQC.eventId
    
System auto-creates issue:
  IssueCreated(A, QCFailed.eventId)
    ↓ causationId: QCFailed.eventId
    
Developer resolves:
  IssueResolved(A, IssueCreated.eventId)
    ↓ causationId: IssueCreated.eventId
    
All events share correlationId: A
Full chain traceable via EventStore.getEventsByCausality(A)
```

---

## Module Dependency Graph

```
┌────────────────────────────────────────────────────┐
│                   Event Bus (Singleton)            │
│  InMemoryEventBus (DI: EVENT_BUS token)           │
└────────────────────────────────────────────────────┘
                         ↑
                         │ publishes/subscribes
                         ↓
    ┌──────────────────────────────────────────────┐
    │              Use Cases (11)                  │
    │  CreateTask, SubmitForQC, PassQC, FailQC,   │
    │  Approve, Reject, CreateIssue, Resolve, etc. │
    └──────────────────────────────────────────────┘
         ↑                                      ↑
         │ inject                               │ inject
         │                                      │
    ┌────────────┐                         ┌─────────────┐
    │  Modules   │                         │ Event Store │
    │  (12)      │                         │ (Singleton) │
    │            │←────────────────────────┤ InMemory    │
    │ Tasks      │  query events           │             │
    │ QC         │                         │ Replay-safe │
    │ Acceptance │                         │ Immutable   │
    │ Issues     │                         └─────────────┘
    │ Daily      │
    │ Docs       │
    │ Members    │
    │ Perms      │
    │ Overview   │
    │ Calendar   │
    │ Settings   │
    │ Audit      │
    └────────────┘
```

---

**Last Updated**: 2024-01-25
**Reference**: EVENT_AUDIT_REPORT.md
