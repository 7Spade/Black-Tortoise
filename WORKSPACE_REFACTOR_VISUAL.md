# Workspace DDD Refactoring - Visual Guide

## Current State (Before Refactoring)

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER                                          │
│ ┌─────────────────┐  ┌──────────────────┐                  │
│ │ Workspace       │  │ Workspace Host   │                  │
│ │ Switcher        │  │ Container        │                  │
│ └────────┬────────┘  └────────┬─────────┘                  │
│          │                    │                             │
└──────────┼────────────────────┼─────────────────────────────┘
           │                    │
           │ inject()           │ inject()
           ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│ APPLICATION LAYER                                           │
│ ┌──────────────────────────────────────────────────┐        │
│ │ WorkspaceContextStore (NgRx Signals)             │        │
│ │ - currentWorkspace: WorkspaceEntity ❌ (wrong)   │        │
│ │ - availableWorkspaces: WorkspaceEntity[] ❌      │        │
│ └──────────────┬───────────────────────────────────┘        │
│                │                                             │
│ ┌──────────────▼───────────────┐                            │
│ │ WorkspaceFacade              │                            │
│ │ - UI coordination            │                            │
│ └──────────────┬───────────────┘                            │
│                │                                             │
│ ┌──────────────▼──────────────┬────────────────┐            │
│ │ CreateWorkspaceUseCase      │ Switch...Case  │            │
│ │ Uses: WorkspaceEntity ❌    │                │            │
│ └─────────────────────────────┴────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                 │
                 │ import (mixed usage)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ DOMAIN LAYER (⚠️ DUPLICATION PROBLEM)                      │
│                                                              │
│ ┌──────────────────────┐  ┌──────────────────────┐         │
│ │ workspace.entity.ts  │  │ workspace.aggregate  │         │
│ │ ==================== │  │ ==================== │         │
│ │ + moduleIds          │  │ + isActive           │         │
│ │ + organizationName   │  │ + version            │         │
│ │ - NO isActive ❌     │  │ + WorkspaceId VO     │         │
│ │ - NO version ❌      │  │ - NO moduleIds ❌    │         │
│ └──────────────────────┘  └──────────────────────┘         │
│   Used by: Use Cases      Used by: Repository iface        │
│                                                              │
│ ┌─────────────────────────────────────────────────┐         │
│ │ workspace-context.ts (Domain) ❌ WRONG LAYER    │         │
│ │ - Contains runtime state (belongs in App!)      │         │
│ │ - activeModuleId, permissions                   │         │
│ └─────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## Target State (After Refactoring)

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER                                          │
│ ┌─────────────────┐  ┌──────────────────┐                  │
│ │ Workspace       │  │ Workspace Host   │                  │
│ │ Switcher        │  │ Container        │                  │
│ └────────┬────────┘  └────────┬─────────┘                  │
│          │                    │                             │
└──────────┼────────────────────┼─────────────────────────────┘
           │                    │
           │ inject()           │ inject()
           │ ONLY APPLICATION   │ ONLY APPLICATION
           ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│ APPLICATION LAYER ✅ STATE LIVES HERE                       │
│ ┌──────────────────────────────────────────────────┐        │
│ │ WorkspaceContextStore (NgRx Signals) ✅           │        │
│ │ - currentWorkspace: WorkspaceAggregate ✅         │        │
│ │ - availableWorkspaces: WorkspaceAggregate[] ✅    │        │
│ │ - permissions: WorkspacePermissions ✅ NEW        │        │
│ │ - activeModuleId: string | null ✅                │        │
│ └──────────────┬───────────────────────────────────┘        │
│                │                                             │
│ ┌──────────────▼───────────────┐                            │
│ │ WorkspaceFacade              │                            │
│ │ - Reactive signals           │                            │
│ └──────────────┬───────────────┘                            │
│                │                                             │
│ ┌──────────────▼──────────────┬────────────────┐            │
│ │ CreateWorkspaceUseCase ✅   │ Switch...Case  │            │
│ │ Uses: WorkspaceAggregate    │                │            │
│ └─────────────────────────────┴────────────────┘            │
│                                                              │
│ ┌─────────────────────────────────────────────────┐         │
│ │ workspace-permissions.model.ts ✅ NEW           │         │
│ │ - Extracted from domain context                │         │
│ └─────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                 │
                 │ import (clean dependency)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ DOMAIN LAYER ✅ STATELESS, SINGLE SOURCE OF TRUTH           │
│                                                              │
│ ┌────────────────────────────────────────────────┐          │
│ │ workspace.aggregate.ts ✅ UNIFIED              │          │
│ │ ============================================== │          │
│ │ + id: string (not VO, simpler)                │          │
│ │ + name: string                                 │          │
│ │ + organizationId: string                       │          │
│ │ + organizationDisplayName: string              │          │
│ │ + ownerId: string                              │          │
│ │ + ownerType: 'user' | 'organization'           │          │
│ │ + moduleIds: string[] ✅                       │          │
│ │ + isActive: boolean ✅                         │          │
│ │ + version: number ✅                           │          │
│ │ + createdAt: Date                              │          │
│ │ + updatedAt: Date                              │          │
│ └────────────────────────────────────────────────┘          │
│                                                              │
│ ✅ Pure functions: createWorkspace(), renameWorkspace()     │
│ ✅ Domain service: validateWorkspaceName()                  │
│ ✅ Repository interface: WorkspaceRepository                │
│                                                              │
│ ❌ workspace.entity.ts → DELETED                            │
│ ❌ workspace-context.ts → DELETED                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Migration Path

### Phase 1: Consolidate Domain Model
```
workspace.entity.ts  ┐
                     ├──► workspace.aggregate.ts (unified)
workspace.aggregate  ┘
```

### Phase 2-3: Update Application Layer
```
Before:
  WorkspaceContextStore
    └── WorkspaceEntity (wrong)

After:
  WorkspaceContextStore
    ├── WorkspaceAggregate ✅
    └── WorkspacePermissions ✅ (new)
```

### Phase 4: Infrastructure Alignment
```
WorkspaceRuntimeFactory
  Before: WorkspaceEntity
  After:  WorkspaceAggregate ✅
```

### Phase 5: Presentation Cleanup
```
Presentation Layer Components
  ❌ Before: import { WorkspaceEntity } from '@domain/...'
  ✅ After:  inject(WorkspaceFacade) only
```

---

## Key Benefits

### ✅ Single Source of Truth
- One `WorkspaceAggregate` instead of two conflicting types
- All fields in one place (moduleIds + isActive + version)

### ✅ Proper Layer Separation
```
Presentation → Application → Domain
    (UI)     →  (State)    → (Logic)
```

### ✅ State in Application Layer
- WorkspaceContextStore holds ALL runtime state
- Domain layer is stateless (pure functions)
- No domain-layer context confusion

### ✅ Type Safety
- Consistent types across all layers
- No mapping/conversion needed
- TypeScript catches violations

---

## File Changes Summary

### Domain Layer (3 files)
- ✏️  `workspace.aggregate.ts` - Update with all fields
- 🗑️  `workspace.entity.ts` - Delete
- 🗑️  `workspace-context.ts` - Delete

### Application Layer (6 files)
- ✏️  `workspace-context.store.ts` - Update types
- ✏️  `create-workspace.use-case.ts` - Update imports
- ✏️  `switch-workspace.use-case.ts` - Update imports
- ✏️  `workspace.facade.ts` - Update computed signals
- ✏️  `workspace-host.facade.ts` - Update types
- ➕  `workspace-permissions.model.ts` - New file

### Infrastructure Layer (1 file)
- ✏️  `workspace-runtime.factory.ts` - Update types

### Presentation Layer (4+ directories)
- ✅  Verify no @domain imports (should already be clean)

---

## Verification Commands

```bash
# Check for entity usage (should be 0 after migration)
grep -r "WorkspaceEntity" src/app --include="*.ts" | grep -v ".spec.ts" | wc -l

# Check for aggregate usage (should increase)
grep -r "WorkspaceAggregate" src/app --include="*.ts" | grep -v ".spec.ts" | wc -l

# Check for domain imports in presentation (should be 0)
grep -r "import.*@domain" src/app/presentation --include="*.ts" | wc -l

# Verify build
npm run build
```

---

## Success Indicators

✅ **Single Domain Model**: Only WorkspaceAggregate exists  
✅ **State Centralized**: All state in WorkspaceContextStore  
✅ **Clean Boundaries**: No Presentation → Domain imports  
✅ **Build Green**: Zero TypeScript errors  
✅ **Tests Pass**: All workspace features working  

---

**Next Steps**: Start with Phase 1, Task 1 in `plan/refactor-workspace-ddd-layers-1.md`
