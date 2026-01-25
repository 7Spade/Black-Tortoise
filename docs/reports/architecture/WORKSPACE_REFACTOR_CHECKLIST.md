# Workspace DDD Refactoring - Quick Checklist

> **Full Plan**: See `plan/refactor-workspace-ddd-layers-1.md` for detailed implementation guide

## Overview
Consolidate workspace domain models and enforce DDD layer boundaries.

## Quick Stats
- **7 Phases** | **38 Tasks** | **17 Files**
- **Time Estimate**: 4-6 hours (incremental)
- **Risk Level**: Medium (requires careful import updates)

---

## Phase 1: Domain Consolidation ⬜

- [ ] TASK-001: Review entity vs aggregate differences
- [ ] TASK-002: Create unified WorkspaceAggregate interface
- [ ] TASK-003: Update factory functions
- [ ] TASK-004: Mark workspace.entity.ts as @deprecated
- [ ] TASK-005: Make WorkspaceId VO optional

**Verify**: Build passes, no new errors

---

## Phase 2: Application Updates ⬜

- [ ] TASK-006: Update create-workspace.use-case.ts
- [ ] TASK-007: Update switch-workspace.use-case.ts
- [ ] TASK-008: Update workspace-context.store.ts types
- [ ] TASK-009: Update workspace.facade.ts
- [ ] TASK-010: Update workspace-host.facade.ts
- [ ] TASK-011: Verify all application files

**Verify**: Build passes, facades work correctly

---

## Phase 3: Remove Domain Context ⬜

- [ ] TASK-012: Find all WorkspaceContext imports
- [ ] TASK-013: Move permissions to application layer
- [ ] TASK-014: Update store with permissions
- [ ] TASK-015: Mark workspace-context.ts as @deprecated
- [ ] TASK-016: Remove domain context imports

**Verify**: No runtime context errors

---

## Phase 4: Infrastructure Alignment ⬜

- [ ] TASK-017: Review workspace-runtime.factory.ts
- [ ] TASK-018: Update runtime factory interface
- [ ] TASK-019: Update runtime token
- [ ] TASK-020: Verify factory implementation
- [ ] TASK-021: Update repository if exists

**Verify**: Infrastructure implements correct interfaces

---

## Phase 5: Presentation Cleanup ⬜

- [ ] TASK-022: Scan presentation/workspace/*
- [ ] TASK-023: Scan presentation/containers/workspace-host/*
- [ ] TASK-024: Scan presentation/shared/components/workspace-switcher/*
- [ ] TASK-025: Replace domain imports
- [ ] TASK-026: Update component types

**Verify**: Zero @domain imports in presentation

---

## Phase 6: Remove Deprecated ⬜

- [ ] TASK-027: Verify zero workspace.entity.ts imports
- [ ] TASK-028: Verify zero workspace-context.ts imports
- [ ] TASK-029: Delete workspace.entity.ts
- [ ] TASK-030: Delete workspace-context.ts
- [ ] TASK-031: Update barrel exports

**Verify**: Codebase clean, no dead imports

---

## Phase 7: Final Verification ⬜

- [ ] TASK-032: Build (`npm run build`)
- [ ] TASK-033: Lint (`npm run lint`)
- [ ] TASK-034: Run architecture checker
- [ ] TASK-035: Test workspace creation
- [ ] TASK-036: Test workspace switching
- [ ] TASK-037: Test state persistence
- [ ] TASK-038: Run unit tests

**Verify**: All systems green ✅

---

## Critical Files Map

### Domain Layer
```
src/app/domain/
├── aggregates/
│   └── workspace.aggregate.ts      ← CONSOLIDATE HERE
├── workspace/
│   ├── workspace.entity.ts         ← DELETE (Phase 6)
│   └── workspace-context.ts        ← DELETE (Phase 6)
└── repositories/
    └── workspace.repository.ts     ← UPDATE signatures
```

### Application Layer
```
src/app/application/
├── stores/
│   └── workspace-context.store.ts  ← STATE LIVES HERE
├── workspace/
│   ├── create-workspace.use-case.ts
│   ├── switch-workspace.use-case.ts
│   └── workspace.facade.ts
└── models/
    └── workspace-permissions.model.ts  ← CREATE NEW
```

### Infrastructure Layer
```
src/app/infrastructure/
└── runtime/
    └── workspace-runtime.factory.ts  ← UPDATE types
```

---

## DDD Layer Rules (Reminder)

```
✅ ALLOWED                           ❌ FORBIDDEN
Presentation → Application          Presentation → Domain
Application  → Domain               Application  → Presentation
Infrastructure → Application        Domain → Any outer layer
```

---

## Commands

```bash
# Start refactoring
cd /home/runner/work/Black-Tortoise/Black-Tortoise

# Check current state
npm run build
npm run lint

# Find workspace imports
grep -r "WorkspaceEntity" src/app --include="*.ts" | grep -v ".spec.ts"
grep -r "WorkspaceAggregate" src/app --include="*.ts" | grep -v ".spec.ts"

# After each phase
npm run build && echo "✅ Build passed"

# Final verification
npm run build && npm run lint && npm run test
```

---

## Rollback Plan

If issues arise:
1. **Partial completion**: Mark last completed task, leave remaining
2. **Build errors**: Revert last phase's changes
3. **Runtime errors**: Check facade imports and state types

**Git Safety**: Commit after each phase with message:
```bash
git commit -m "refactor(workspace): Phase X - [phase goal]"
```

---

## Success Criteria

✅ Single WorkspaceAggregate in domain layer  
✅ All state in WorkspaceContextStore  
✅ Zero presentation → domain violations  
✅ Build passes with zero errors  
✅ UI workspace features functional  
✅ No deprecated files remain  

---

**Full documentation**: `plan/refactor-workspace-ddd-layers-1.md`
